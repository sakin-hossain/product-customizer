// @ts-nocheck
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  Badge,
  Button,
  Card,
  FormLayout,
  InlineStack,
  Page,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  const metaFieldDetails: any = await admin.rest.resources.Metafield.find({
    session: session,
    product_id: params.productId,
    id: params.metaId,
  });

  const parsedValue = JSON.parse(metaFieldDetails.value);
  const options = parsedValue.data;
  const filteredMetaField: any = options.filter(
    (option: any) => option.id == params.variantId
  );

  return json({
    metaFieldDetails: filteredMetaField,
    product_id: params.productId,
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const product_id = params.productId;
  const metafield_id = params.metaId;

  const metaFieldDetails: any = await admin.rest.resources.Metafield.find({
    session: session,
    product_id: params.productId,
    id: params.metaId,
  });

  const parsedValue = JSON.parse(metaFieldDetails.value);
  const metaFieldValues = parsedValue.data;

  const filteredMetaFieldValue: any = metaFieldValues.filter(
    (value: any) => value.id != params.variantId
  );

  const formData = await request.formData();

  const label = formData.get("label");
  const option = formData.get("option");

  const product: any = new admin.rest.resources.Metafield({ session: session });
  const body = JSON.stringify({
    name: "caractere_product_customizer",
    data: [
      ...filteredMetaFieldValue,
      { id: params.variantId, option: option, label: label },
    ],
  });

  product.product_id = product_id;
  product.id = metafield_id;
  product.value = body;
  product.type = "single_line_text_field";
  await product.save({
    update: true,
  });

  return json({ msg: "Updated Successfully", body: body });
}

export default function EditMetaField() {
  const { metaFieldDetails, product_id } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  // const parsedValue = JSON.parse(metaFieldDetails.value);
  const [label, setLabel] = useState<string>(metaFieldDetails[0].label);
  const [option, setOption] = useState<any>(metaFieldDetails[0].option);

  return (
    <Page
      narrowWidth
      backAction={{
        content: "Meta Field Details",
        url: `/app/${product_id}/edit`,
      }}
      secondaryActions={
        <Form
          action="destroy"
          method="post"
          onSubmit={(event) => {
            const response = confirm(
              "Please confirm you want to delete this record."
            );
            if (!response) {
              event.preventDefault();
            }
          }}
        >
          <Button variant="primary" tone="critical" submit>
            Delete
          </Button>
        </Form>
      }
      title={label}
    >
      <div style={{ margin: "16px 0" }}>
        {data?.msg && <Badge tone="success">{data?.msg}</Badge>}
      </div>
      <Card>
        <Form method="post">
          <FormLayout>
            <TextField
              id="label"
              name="label"
              label="Label"
              autoComplete="off"
              value={label}
              onChange={(value) => setLabel(value)}
            />
            <TextField
              id="option"
              name="option"
              label="Option"
              autoComplete="off"
              value={option}
              onChange={(value) => setOption(value)}
            />
            <InlineStack align="end">
              <Button variant="primary" submit>
                Update Variant
              </Button>
            </InlineStack>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}

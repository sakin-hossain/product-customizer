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
import { useEffect, useState } from "react";
import MetaFieldList from "~/components/MetaFieldList";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const productDetails: any = await admin.rest.resources.Product.find({
    session: session,
    id: params.productId,
  });

  const metaFieldList = await admin.rest.resources.Metafield.all({
    session: session,
    metafield: { owner_id: params.productId, owner_resource: "product" },
  });

  const filteredMetaField = metaFieldList.data.filter(
    (item: any) => item.namespace === "caractere"
  );

  return json({
    productDetails: productDetails,
    metaFieldList: filteredMetaField,
    productId: params.productId,
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);

  const productDetails: any = await admin.rest.resources.Product.find({
    session: session,
    id: params.productId,
  });

  const metaFieldList = await admin.rest.resources.Metafield.all({
    session: session,
    metafield: { owner_id: params.productId, owner_resource: "product" },
  });

  const filteredMetaField: any = metaFieldList.data.filter(
    (item: any) => item.namespace === "caractere"
  );

  const formData = await request.formData();

  const label = formData.get("label");
  const option = formData.get("option");

  const parsedData = JSON.parse(filteredMetaField[0].value) || {};
  const existingData = parsedData.data;
  const productLength = productDetails.options.length;
  const id = productLength + existingData.length + 1;

  const updatedData = [
    ...existingData,
    { id: id, label: label, option: option },
  ];

  const product: any = new admin.rest.resources.Metafield({ session: session });

  product.product_id = params.productId;
  product.id = filteredMetaField[0].id;
  product.value = JSON.stringify({
    name: "caractere_product_customizer",
    data: updatedData,
  });
  product.type = "single_line_text_field";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await product.save({
    update: true,
  });

  return json({ msg: "Added successfully" });
}

const ProductMetaFieldEdit = () => {
  const data = useActionData<typeof action>();
  const { metaFieldList, productId, productDetails } =
    useLoaderData<typeof loader>();

  const [label, setLabel] = useState<string>("");
  const [option, setOption] = useState<any>("");

  useEffect(() => {
    setOption("");
    setLabel("");
  }, [data?.msg]);

  return (
    <Page
      narrowWidth
      backAction={{ content: "Products", url: "/app" }}
      title={productDetails?.title}
    >
      <Card>
        {metaFieldList.map((item: any, index: number) => (
          <MetaFieldList
            item={item}
            index={index}
            key={index}
            productId={productId}
          />
        ))}
      </Card>
      <div style={{ margin: "20px" }}></div>
      <Card>
        <Form method="post">
          <FormLayout>
            {data?.msg && option.length === 0 && label.length === 0 && (
              <Badge tone="success">{data?.msg}</Badge>
            )}
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
              helpText="Please enter colors, such as #000000, #ffffff in the input field."
              onChange={(value) => setOption(value)}
            />
            <InlineStack align="end">
              <Button variant="primary" submit>
                Create New Variant
              </Button>
            </InlineStack>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
};

export default ProductMetaFieldEdit;

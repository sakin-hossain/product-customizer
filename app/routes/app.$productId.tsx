import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  Badge,
  Button,
  Card,
  FormLayout,
  Page,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";
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

  return json({
    productDetails: productDetails,
    metaFieldList: metaFieldList.data,
    productId: params.productId,
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  console.log("first");
  const id = params.productId;

  const formData = await request.formData();

  const label = formData.get("label");
  const option = formData.get("option");

  const { admin, session } = await authenticate.admin(request);
  const product: any = new admin.rest.resources.Product({ session: session });
  const body = JSON.stringify({ label: label, option: option });

  product.id = id;
  product.metafields = [
    {
      key: "product_customizer",
      value: body,
      type: "single_line_text_field",
      namespace: "caractere",
    },
  ];
  const response = await product.save({
    update: true,
  });

  if (response) {
    const data = response.json();
    console.log(data, "data");
    return json({ msg: "Saved successfully" });
  }
  return json({ msg: "Saved successfully" });
}

const ProductDetails = () => {
  const { productDetails, metaFieldList, productId } =
    useLoaderData<typeof loader>();

  const filteredMetaField: any = metaFieldList.filter(
    (item: any) => item.namespace === "caractere"
  );

  console.log(filteredMetaField, "filteredMetaField");
  const [label, setLabel] = useState<string>("");
  const [option, setOption] = useState<any>("");

  const data = useActionData<typeof action>();

  return (
    <Page
      backAction={{ content: "Products", url: "/app" }}
      title={productDetails.title}
    >
      {data?.msg && <Badge tone="success">{data?.msg}</Badge>}

      <Card>
        {filteredMetaField.map((item: any, index: number) => (
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
            {/* <div style={{ marginBottom: "24px" }}> */}
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
            {/* </div> */}
            <Button variant="primary" submit>
              Create New Variant
            </Button>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
};

export default ProductDetails;

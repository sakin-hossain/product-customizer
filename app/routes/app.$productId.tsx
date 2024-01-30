import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button, Page, Text, TextField } from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  const productDetails: any = await admin.rest.resources.Product.find({
    session: session,
    id: params.productId,
  });
  return json({ productDetails });
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
      key: "testing_pc",
      value: body,
      type: "single_line_text_field",
      namespace: "global",
    },
  ];
  const response = await product.save({
    update: true,
  });
  console.log(response, "res");
  if (response) {
    const data = response.json();
    console.log(data, "data");
    return json({ msg: "Saved successfully" });
  }
  return json({ msg: "Saved successfully" });
}

const ProductDetails = () => {
  const { productDetails } = useLoaderData<typeof loader>();

  const [label, setLabel] = useState<string>("");
  const [option, setOption] = useState<string>("");

  const data = useActionData<typeof action>();

  return (
    <Page>
      {data?.msg && <p>{data?.msg}</p>}
      <Text variant="headingXl" as="h2">
        {productDetails.title}
      </Text>
      <Form method="post">
        <TextField
          id="label"
          name="label"
          label="label"
          autoComplete="off"
          value={label}
          onChange={(value) => setLabel(value)}
        />
        <TextField
          id="option"
          name="option"
          label="option"
          autoComplete="off"
          value={option}
          onChange={(value) => setOption(value)}
        />
        <Button submit>Create Variant</Button>
      </Form>
    </Page>
  );
};

export default ProductDetails;

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { Button, Card, Page } from "@shopify/polaris";
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
  const id = params.productId;

  const { admin, session } = await authenticate.admin(request);
  const product: any = new admin.rest.resources.Product({ session: session });

  product.id = id;
  product.metafields = [
    {
      key: "product_customizer",
      value: JSON.stringify({ name: "caractere_product_customizer", data: [] }),
      type: "single_line_text_field",
      namespace: "caractere",
    },
  ];
  const response = await product.save({
    update: true,
  });
  return redirect(`/app/${params.productId}/edit/`);
}
const ProductDetails = () => {
  const { productDetails } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  console.log(data, "data");

  // const [label, setLabel] = useState<string>("");
  // const [option, setOption] = useState<any>("");

  return (
    <Page
      backAction={{ content: "Products", url: "/app" }}
      title={productDetails.title}
    >
      {/* <Card>
        {filteredMetaField.map((item: any, index: number) => (
          <MetaFieldList
            item={item}
            index={index}
            key={index}
            productId={productId}
          />
        ))}
      </Card> */}
      <div style={{ margin: "20px" }}></div>
      <Card>
        <Form method="post">
          <Button submit variant="primary">
            Create a virtual option
          </Button>
        </Form>

        {/* <Form method="post">
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
            <Button variant="primary" submit>
              Create New Variant
            </Button>
          </FormLayout>
        </Form> */}
      </Card>
    </Page>
  );
};

export default ProductDetails;

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigate } from "@remix-run/react";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const response = await product.save({
    update: true,
  });
  return redirect(`/app/${params.productId}/edit/`);
}
const ProductDetails = () => {
  const { productDetails, metaFieldList, productId } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const filteredMetaField = metaFieldList.filter(
    (item: any) => item.namespace === "caractere"
  );

  return (
    <Page
      backAction={{ content: "Products", url: "/app" }}
      title={productDetails.title}
    >
      <div style={{ margin: "20px" }}></div>
      <Card>
        {filteredMetaField.length > 0 ? (
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate(`/app/${productId}/edit`)}
          >
            See your variant
          </Button>
        ) : (
          <Form method="post">
            <Button size="large" submit variant="primary">
              Create a virtual option
            </Button>
          </Form>
        )}
      </Card>
    </Page>
  );
};

export default ProductDetails;

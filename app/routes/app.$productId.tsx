// @ts-nocheck
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { BlockStack, Button, Card, Page, Text } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";

import indexStyles from "../routes/_index/style.css";

export const links = () => [{ rel: "stylesheet", href: indexStyles }];

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

export async function action({ request, params }: ActionFunction) {
  await new Promise((res) => setTimeout(res, 1000)); // Simulate server delay

  const id = params.productId;
  const { admin, session } = await authenticate.admin(request);

  const product: any = new admin.rest.resources.Product({
    session: session,
  });

  product.id = id;
  product.metafields = [
    {
      key: "product_customizer_variants",
      value: JSON.stringify({
        name: "caractere_product_customizer_variants",
        data: [],
      }),
      type: "single_line_text_field",
      namespace: "caractere",
    },
    {
      key: "product_customizer_image",
      value: JSON.stringify({
        name: "caractere_product_customizer_image",
        data: [],
      }),
      type: "single_line_text_field",
      namespace: "caractere",
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await product.save({
    update: true,
  });
  return redirect(`/app/${params.productId}/edit/`);
}
const ProductDetails = () => {
  const { productDetails, metaFieldList, productId } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const imageMetaField = metaFieldList?.filter(
    (item: any) => item.key === "product_customizer_image"
  );

  return (
    <Page
      narrowWidth
      backAction={{ content: "Products", url: "/app" }}
      title={productDetails.title}
    >
      <div style={{ margin: "20px" }}></div>
      <Card>
        <Form method="post">
          {imageMetaField.length > 0 ? (
            <>
              <BlockStack gap="200">
                <div className="mb-4">
                  <Text as="h2" variant="headingSm" fontWeight="regular">
                    Please click the button below to reveal the available
                    variants for this product.
                  </Text>
                </div>
              </BlockStack>
              <BlockStack gap="200">
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => navigate(`/app/${productId}/edit`)}
                >
                  See your variants and image
                </Button>
              </BlockStack>
            </>
          ) : (
            <>
              <BlockStack gap="200">
                <div className="mb-4">
                  <Text as="h2" variant="headingSm" fontWeight="regular">
                    Please click the button below to create options for{" "}
                    <strong>{productDetails.title}</strong>.
                  </Text>
                </div>
                <Button size="large" submit>
                  Create Variants and Images
                </Button>
              </BlockStack>
            </>
          )}
        </Form>
      </Card>
    </Page>
  );
};

export default ProductDetails;

// @ts-nocheck
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { BlockStack, Button, Card, Page, Text } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";

enum FormNames {
  VARIANTS_FORM = "variant",
  IMAGE_FORM = "image",
}

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
  const formData = await request.formData();
  const formName = formData.get("formName");
  const id = params.productId;
  const { admin, session } = await authenticate.admin(request);

  switch (formName) {
    case FormNames.VARIANTS_FORM:
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
      ];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await product.save({
        update: true,
      });
      return redirect(`/app/${params.productId}/edit/`);
    case FormNames.IMAGE_FORM:
      const productImage: any = new admin.rest.resources.Product({
        session: session,
      });

      productImage.id = id;
      productImage.metafields = [
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
      await productImage.save({
        update: true,
      });
      return redirect(`/app/${params.productId}/edit/`);
    default:
      return json({ message: "Clicked in default" });
  }
}
const ProductDetails = () => {
  const navigation = useNavigation();
  const formName = navigation.submission?.formData.get("formName");

  let variantFormText = "Create a virtual option";
  let imageFormText = "Create a customized image";

  switch (formName) {
    case FormNames.VARIANTS_FORM:
      variantFormText =
        navigation.state === "submitting"
          ? "Create a virtual option..."
          : "Create a virtual option";
      break;
    case FormNames.IMAGE_FORM:
      imageFormText = navigation.state = "submitting"
        ? "Create a customized image..."
        : "Create a customized image";
      break;
    default:
  }

  const { productDetails, metaFieldList, productId } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const variantsMetaField = metaFieldList.filter(
    (item: any) => item.key === "product_customizer_variants"
  );
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
      <Card roundedAbove="sm">
        <BlockStack gap={600}>
          <BlockStack gap="200">
            <Text variant="headingLg" as="h5" fontWeight="medium">
              Product Variants
            </Text>
            <Form method="post">
              {variantsMetaField.length > 0 ? (
                <>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingSm" fontWeight="regular">
                      Please click the button below to reveal the available
                      variants for this product.
                    </Text>
                  </BlockStack>
                  <BlockStack gap="200">
                    <Button
                      variant="primary"
                      size="large"
                      onClick={() => navigate(`/app/${productId}/edit`)}
                    >
                      See your variant
                    </Button>
                  </BlockStack>
                </>
              ) : (
                <>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingSm" fontWeight="regular">
                      Please click the button below to create options for{" "}
                      <strong>{productDetails.title}</strong>.
                    </Text>
                    <input
                      type="hidden"
                      name="formName"
                      value={FormNames.VARIANTS_FORM}
                    />
                    <Button size="large" submit>
                      {variantFormText}
                    </Button>
                  </BlockStack>
                </>
              )}
            </Form>
          </BlockStack>
          <BlockStack gap={400}>
            <Text variant="headingLg" as="h5" fontWeight="medium">
              Product Customize Image
            </Text>
            <BlockStack gap={200}>
              <Form method="post">
                <input
                  type="hidden"
                  name="formName"
                  value={FormNames.IMAGE_FORM}
                />
                {imageMetaField.length > 0 ? (
                  <>
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingSm" fontWeight="regular">
                        Please click the button below to reveal the image for
                        this product.
                      </Text>
                    </BlockStack>
                    <BlockStack gap="200">
                      <Button
                        variant="primary"
                        size="large"
                        onClick={() => navigate(`/app/${productId}/edit`)}
                      >
                        See your image
                      </Button>
                    </BlockStack>
                  </>
                ) : (
                  <>
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingSm" fontWeight="regular">
                        Please click the button below to create customizer for{" "}
                        <strong>{productDetails.title}</strong>.
                      </Text>
                      <Button submit size="large">
                        {imageFormText}
                      </Button>
                    </BlockStack>
                  </>
                )}
              </Form>
            </BlockStack>
          </BlockStack>
        </BlockStack>
      </Card>
    </Page>
  );
};

export default ProductDetails;

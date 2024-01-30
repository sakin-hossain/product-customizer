import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { useState } from "react";
import indexStyles from "../routes/_index/style.css";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: indexStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("enter");
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data?.productCreate?.product,
  });
};

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const selected = async () => {
    const productDetails = await shopify.resourcePicker({
      type: "product",
    });
    if (productDetails) {
      setIsLoading(true);
      setSelectedProduct(productDetails[0]);
      const splitId = productDetails[0].id.split("/");
      const id = splitId[4];
      console.log(id, id);
      setIsLoading(false);
      navigate(`/app/${id}`);
    } else {
      console.log("Picker was cancelled by the user");
    }
  };

  return (
    <Page>
      <Card roundedAbove="md" background="bg-surface-secondary">
        {!isLoading ? (
          <Box paddingBlock="500">
            <Text variant="headingXl" as="h2">
              Welcome to product customizer
            </Text>
            <Box paddingBlock={"400"}>
              <BlockStack>
                <Button
                  size="large"
                  variant="primary"
                  onClick={() => {
                    selected();
                  }}
                >
                  Choose your product
                </Button>
              </BlockStack>
            </Box>
          </Box>
        ) : (
          <Spinner accessibilityLabel="Spinner example" size="large" />
        )}
      </Card>
    </Page>
  );
}

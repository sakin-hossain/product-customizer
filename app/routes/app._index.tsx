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

export const links = () => [{ rel: "stylesheet", href: indexStyles }];

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
      setIsLoading(false);
      navigate(`/app/${id}`);
    } else {
      console.log("Picker was cancelled by the user");
    }
  };

  return (
    <Page narrowWidth>
      <Card roundedAbove="md" background="bg-surface-secondary">
        {!isLoading ? (
          <Box paddingBlock="500">
            <Text variant="headingXl" as="h2">
              Welcome to Product Customizer app
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

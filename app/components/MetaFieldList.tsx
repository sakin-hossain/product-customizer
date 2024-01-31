import { useNavigate } from "@remix-run/react";
import { BlockStack, Box, Button, InlineGrid, Text } from "@shopify/polaris";

const MetaFieldList = ({ item, index, productId }: any) => {
  const navigate = useNavigate();
  const name = JSON.parse(item.value);
  console.log(item, "list");

  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        {name.data.map((list: any, index: number) => (
          <Box key={index}>
            <InlineGrid columns="1fr auto">
              <Text as="h2" variant="headingSm">
                {list.label}
              </Text>
              <Button
                variant="plain"
                onClick={() => {
                  navigate(`/app/${productId}/edit/${item.id}`);
                }}
              >
                Edit
              </Button>
            </InlineGrid>
          </Box>
        ))}
      </BlockStack>
    </BlockStack>
  );
};

export default MetaFieldList;

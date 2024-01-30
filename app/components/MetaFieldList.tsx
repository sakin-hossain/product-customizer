import { useNavigate } from "@remix-run/react";
import { BlockStack, Button, InlineGrid, Text } from "@shopify/polaris";

const MetaFieldList = ({ item, index, productId }: any) => {
  const navigate = useNavigate();
  const name = JSON.parse(item.value);
  return (
    <BlockStack gap="400">
      <BlockStack gap="200">
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="headingSm">
            {name.label}
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
      </BlockStack>
    </BlockStack>
  );
};

export default MetaFieldList;

import { useNavigate } from "@remix-run/react";
import { BlockStack, Box, Button, InlineGrid, Text } from "@shopify/polaris";

const MetaFieldList = ({ item, index, productId, selected }: any) => {
  const navigate = useNavigate();
  const name = JSON.parse(item.value);
  let uniqueFillColors;
  if (
    item.key === "product_customizer_image" &&
    selected === 1 &&
    name.data.length > 0
  ) {
    const svgString = name.data; // Your SVG string
    const fillRegex = /fill="([^"]*)"/g;
    const matches = svgString.match(fillRegex);
    const colors = new Set();

    if (matches) {
      matches.forEach((match: any) => {
        const color = match.replace('fill="', "").replace('"', "");
        colors.add(color);
      });
    }
    uniqueFillColors = Array.from(colors);
  }

  return (
    <>
      {item.key === "product_customizer_variants" && selected === 0 && (
        <BlockStack gap="400">
          <BlockStack gap="200">
            {name.data.length > 0 ? (
              name?.data?.map((list: any, index: number) => (
                <Box key={index}>
                  <InlineGrid columns="1fr auto">
                    <Text as="h2" variant="headingSm">
                      {list.label}
                    </Text>
                    <Button
                      variant="plain"
                      onClick={() => {
                        navigate(
                          `/app/${productId}/edit/${item.id}/${list.id}`
                        );
                      }}
                    >
                      Edit
                    </Button>
                  </InlineGrid>
                </Box>
              ))
            ) : (
              <p>No items</p>
            )}
          </BlockStack>
        </BlockStack>
      )}
      {item.key === "product_customizer_image" && selected === 1 && (
        <BlockStack gap="400">
          <BlockStack gap="200">
            <div style={{ display: "flex", gap: "12px" }}>
              {uniqueFillColors &&
                uniqueFillColors.map((color: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: color,
                      width: 20,
                      height: 20,
                      borderRadius: 50,
                    }}
                  ></div>
                ))}
            </div>
            {/* {name.data.length > 0 ? (
              name?.data?.map((list: any, index: number) => (
                <Box key={index}>
                  <InlineGrid columns="1fr auto">
                    <Text as="h2" variant="headingSm">
                      {list.label}
                    </Text>
                    <Button
                      variant="plain"
                      onClick={() => {
                        navigate(
                          `/app/${productId}/edit/${item.id}/${list.id}`
                        );
                      }}
                    >
                      Edit
                    </Button>
                  </InlineGrid>
                </Box>
              ))
            ) : (
              <p>No items</p>
            )} */}
          </BlockStack>
        </BlockStack>
      )}
    </>
  );
};

export default MetaFieldList;

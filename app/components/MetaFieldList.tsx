import { useNavigate } from "@remix-run/react";
import {
  BlockStack,
  Box,
  Button,
  Grid,
  InlineGrid,
  Text,
} from "@shopify/polaris";
import "../routes/_index/style.css";

const MetaFieldList = ({
  item,
  index,
  productId,
  selected,
  remainingColors,
}: any) => {
  const navigate = useNavigate();
  const name = JSON.parse(item.value);
  let uniqueFillColors;
  let svgString;

  if (
    item.key === "product_customizer_image" &&
    selected === 0 &&
    name.data.length > 0
  ) {
    svgString = name.data; // Your SVG string
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
      {item.key === "product_customizer_variants" && selected === 1 && (
        <BlockStack gap="400">
          <BlockStack gap="200">
            {name.data.length > 0 &&
              name?.data?.map((list: any, index: number) => (
                <Box key={index}>
                  <InlineGrid columns="1fr auto">
                    <Text as="h2" variant="headingSm" fontWeight="medium">
                      {list.label} -{" "}
                      <span
                        style={{ backgroundColor: `${list.color}` }}
                        className="color-badge"
                      ></span>
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
              ))}
          </BlockStack>
        </BlockStack>
      )}
      {item.key === "product_customizer_image" &&
        selected === 0 &&
        name.data.length > 0 && (
          <BlockStack gap="400">
            <BlockStack gap="200">
              <div className="mb-12">
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <p className="mb-2">
                      <Text as="h2" variant="headingSm" fontWeight="medium">
                        Colors are
                      </Text>
                    </p>
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
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <div className="svg-card">
                      <Text as="h2" variant="headingSm" fontWeight="medium">
                        Uploaded SVG
                      </Text>
                      <div
                        className="svg-container"
                        dangerouslySetInnerHTML={{ __html: svgString }}
                      />
                    </div>
                  </Grid.Cell>
                </Grid>
              </div>
            </BlockStack>
          </BlockStack>
        )}
    </>
  );
};

export default MetaFieldList;

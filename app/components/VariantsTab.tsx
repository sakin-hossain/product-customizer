import { Form } from "@remix-run/react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  FormLayout,
  InlineStack,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";
import { FormNames } from "~/routes/app.$productId_.edit";

const VariantsTab = ({ data, metaFieldList, productId }: any) => {
  const [label, setLabel] = useState<string>("");
  const [option, setOption] = useState<any>("");
  return (
    <Box>
      <div style={{ margin: "20px 0" }}></div>
      <BlockStack gap={"400"}>
        <Form method="post">
          <input type="hidden" name="formName" value={FormNames.VARIANT_FORM} />
          <FormLayout>
            {data?.msg && <Badge tone="success">{data?.msg}</Badge>}
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
              helpText="Please enter colors, such as #000000, #ffffff in the input field."
              onChange={(value) => setOption(value)}
            />
            <InlineStack align="end">
              <Button variant="primary" submit>
                Create New Variant
              </Button>
            </InlineStack>
          </FormLayout>
        </Form>
      </BlockStack>
    </Box>
  );
};

export default VariantsTab;

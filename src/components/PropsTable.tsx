import { defineComponent, computed, PropType, VNode } from "vue";
import { Input, InputNumber, Slider, Radio, Select } from "ant-design-vue";
import { keyBy, reduce } from "lodash";
import type { TextComponentProps } from "../defaultProps";
import { mapPropsToForm, PropToFormType } from "../propsMap";
import "./PropsTable.css";
import ColorPicker from "@/components/ColorPicker.vue";
import IconSwitch from "@/components/IconSwitch.vue";
const mapToComponent = {
  "a-textarea": Input.TextArea,
  "a-input-number": InputNumber,
  "a-slider": Slider,
  "a-radio-group": Radio.Group,
  "a-radio-button": Radio.Button,
  "a-select": Select,
  "a-select-option": Select.Option,
  ColorPicker,
  IconSwitch,
} as any;

interface FormProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: {
    [key: string]: any;
  };
  text?: string;
  options?: {
    text: string | VNode;
    value: any;
  }[];
  valueProp?: any;
  eventName?: string;
  events: {
    [key: string]: (e: any) => void;
  };
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const PropsTable = defineComponent({
  name: "PropsTable",
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, { emit }) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps;
          const item = mapPropsToForm[newKey];
          if (item) {
            const valueProp = "value";
            const eventName = "change";
            const initialTransform = item.initialTransform;
            const newItem: FormProps = {
              ...item,
              value: initialTransform ? initialTransform(value) : value,
              valueProp,
              eventName,
              events: {
                ["on" + capitalizeFirstLetter(eventName)]: (e: any) => {
                  console.log("e", e);
                  console.log("key", key);
                  console.log("item", item);
                  emit("change", {
                    key,
                    value: item.afterTransform ? item.afterTransform(e) : e,
                  });
                },
              },
            };
            result[newKey] = newItem;
          }
          return result;
        },
        {} as { [key: string]: FormProps }
      );
    });

    return () => (
      <div class="props-table">
        {Object.keys(finalProps.value).map((key) => {
          const value = finalProps.value[key];
          const ComponentName = mapToComponent[value.component];
          const subComponent = value.subComponent
            ? mapToComponent[value.subComponent]
            : null;
          const props = {
            [value.valueProp]: value.value,
            ...value.extraProps,
            ...value.events,
          };
          return (
            <div class="prop-item" key={key}>
              {value.text && <span class="label">{value.text}：</span>}
              <div class="prop-component">
                <ComponentName {...props}>
                  {value.options &&
                    value.options.map((option) => (
                      <subComponent key={option.value} value={option.value}>
                        {option.text}
                      </subComponent>
                    ))}
                </ComponentName>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
});

export default PropsTable;

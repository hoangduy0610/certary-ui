import { List, Typography } from "antd";
import "./PlaceholderButtonGroup.scss";

type PlaceholderButtonGroupProps = {
  buttons: {
    title: string;
    onPress: () => void;
  }[];
};

export const PlaceholderButtonGroup = ({ buttons }: PlaceholderButtonGroupProps) => {
  return (
    <List
      size="small"
      bordered
      dataSource={buttons}
      renderItem={(button) => (
        <List.Item
          style={{
            cursor: "pointer",
            padding: "6px 12px",
          }}
          onClick={button.onPress}
        >
          <Typography.Text strong>{button.title}</Typography.Text>
        </List.Item>
      )}
      style={{ width: "100%", borderRadius: 8 }}
    />
  );
};

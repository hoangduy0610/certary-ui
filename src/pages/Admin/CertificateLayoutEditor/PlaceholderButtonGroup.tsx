import { Button } from "antd";

type PlaceholderButtonGroupProps = {
    buttons: {
        title: string;
        onPress: () => void;
    }[];
};

export const PlaceholderButtonGroup = ({
    buttons,
}: PlaceholderButtonGroupProps) => {
    return (
        <div className="d-flex flex-row gap-2">
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    onClick={button.onPress}
                >
                    {button.title}
                </Button>
            ))}
        </div>
    );
};
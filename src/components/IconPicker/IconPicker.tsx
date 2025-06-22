import * as AntIcons from '@ant-design/icons';
import { List, Modal } from 'antd';
import React, { CSSProperties, useState } from 'react';

interface IconPickerProps {
    visible: boolean;
    onOk: (icon: string) => void;
    onCancel: () => void;
}

export const iconList = [
    {
        name: 'userOutlined',
        component: AntIcons.UserOutlined,
    },
    {
        name: 'dashboardOutlined',
        component: AntIcons.DashboardOutlined,
    },
    {
        name: 'idcardOutlined',
        component: AntIcons.IdcardOutlined,
    },
    {
        name: 'bookOutlined',
        component: AntIcons.BookOutlined,
    },
    {
        name: 'settingOutlined',
        component: AntIcons.SettingOutlined,
    },
    {
        name: 'searchOutlined',
        component: AntIcons.SearchOutlined,
    },
    {
        name: 'plusCircleOutlined',
        component: AntIcons.PlusCircleOutlined,
    },
    {
        name: 'deleteOutlined',
        component: AntIcons.DeleteOutlined,
    },
    {
        name: 'editOutlined',
        component: AntIcons.EditOutlined,
    },
    {
        name: 'checkCircleOutlined',
        component: AntIcons.CheckCircleOutlined,
    },
    {
        name: 'closeCircleOutlined',
        component: AntIcons.CloseCircleOutlined,
    },
    {
        name: 'infoCircleOutlined',
        component: AntIcons.InfoCircleOutlined,
    },
    {
        name: 'warningOutlined',
        component: AntIcons.WarningOutlined,
    },
    {
        name: 'tagOutlined',
        component: AntIcons.TagOutlined,
    },
    {
        name: 'apartmentOutlined',
        component: AntIcons.ApartmentOutlined,
    },
    {
        name: 'usergroupAddOutlined',
        component: AntIcons.UsergroupAddOutlined,
    },
    {
        name: 'teamOutlined',
        component: AntIcons.TeamOutlined,
    },
    {
        name: 'fileTextOutlined',
        component: AntIcons.FileTextOutlined,
    },
    {
        name: 'fileImageOutlined',
        component: AntIcons.FileImageOutlined,
    },
]

const IconPicker: React.FC<IconPickerProps> = ({ visible, onOk, onCancel }) => {
    const [selectedIcon, setSelectedIcon] = useState<string>('userOutlined');

    const handleIconSelect = (icon: string) => {
        setSelectedIcon(icon);
        // onOk(icon);
    };

    return (
        <Modal title="Select an Icon" open={visible} onOk={() => onOk(selectedIcon)} onCancel={onCancel}>
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={iconList}
                renderItem={(item) => (
                    <List.Item onClick={() => handleIconSelect(item.name)} style={{
                        ...selectedIcon === item.name && {
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        },
                        ...{
                            padding: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            gap: 8,
                        }
                    }}>
                        {React.createElement(item.component)}
                        <div>{item.name.replace('Outlined', '')}</div>
                    </List.Item>
                )
                }
            />
        </Modal >
    );
};

const IconDisplay: React.FC<{ icon: string, style?: CSSProperties }> = ({ icon, style }) => {
    const IconComponent = iconList.find(i => i.name === icon)?.component || AntIcons.UserOutlined;
    return React.createElement(IconComponent, { style: style })
};

export { IconDisplay, IconPicker };

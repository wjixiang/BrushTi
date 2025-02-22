import { useState } from 'react';  
import Select, {   
  StylesConfig,   
  GroupBase,   
  ActionMeta,   
  MultiValue,   
  SingleValue,  
  OptionsOrGroups  
} from 'react-select';  

// 定义选项类型  
export interface OptionType {  
  value: string | number;  
  label: string;  
}  

// 组件Props类型  
interface SelectComponentProps {  
  options: OptionsOrGroups<OptionType, GroupBase<OptionType>>;  
  placeholder?: string;  
  isMulti?: boolean;  
  onChange?: (newValue: MultiValue<OptionType> | SingleValue<OptionType>) => void;  
  defaultValue?: OptionType | OptionType[];  
  isSearchable?: boolean;  
  isDisabled?: boolean;  
}  

// 自定义样式 - 使用泛型  
const customStyles: StylesConfig<OptionType, boolean, GroupBase<OptionType>> = {  
  control: (provided, state) => ({  
    ...provided,  
    borderColor: state.isFocused ? '#3182ce' : provided.borderColor,  
    boxShadow: state.isFocused ? '0 0 0 1px #3182ce' : 'none',  
    '&:hover': {  
      borderColor: state.isFocused ? '#3182ce' : provided.borderColor,  
    },  
  }),  
  option: (provided, state) => ({  
    ...provided,  
    backgroundColor: state.isSelected ? '#3182ce' : 'white',  
    color: state.isSelected ? 'white' : 'black',  
    '&:hover': {  
      backgroundColor: state.isSelected ? '#3182ce' : '#f1f1f1',  
    },  
  }),  
};  

export const SelectComponent: React.FC<SelectComponentProps> = ({  
  options,  
  placeholder = '请选择',  
  isMulti = false,  
  onChange,  
  defaultValue,  
  isSearchable = true,  
  isDisabled = false  
}) => {  
  // 内部状态管理 - 使用联合类型  
  const [selectedValue, setSelectedValue] = useState<  
    MultiValue<OptionType> | SingleValue<OptionType>  
  >(defaultValue || null);  

  // 处理变化的通用方法  
  const handleChange = (  
    newValue: MultiValue<OptionType> | SingleValue<OptionType>,   
    actionMeta: ActionMeta<OptionType>  
  ) => {  
    // 更新内部状态  
    setSelectedValue(newValue);  

    // 如果传入了onChange回调，则调用  
    if (onChange) {  
      onChange(newValue);  
    }  

    // 可以根据actionMeta做一些额外的操作  
    console.log('Action:', actionMeta.action);  
  };  

  return (  
    <Select<OptionType, boolean, GroupBase<OptionType>>  
      // 基础属性  
      options={options}  
      placeholder={placeholder}  
      
      // 多选配置  
      isMulti={isMulti}  
      
      // 值和变化处理  
      value={selectedValue}  
      onChange={handleChange}  
      
      // 样式  
      styles={customStyles}  
      
      // 交互配置  
      isSearchable={isSearchable}  
      isDisabled={isDisabled}  
      
      // 其他可选增强  
      closeMenuOnSelect={!isMulti}  
      hideSelectedOptions={false}  
    />  
  );  
};  


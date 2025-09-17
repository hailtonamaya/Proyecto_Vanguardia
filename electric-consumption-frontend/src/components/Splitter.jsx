import { Flex, Splitter, Typography } from 'antd';

const Desc = props => (
  <Flex justify="center" align="center" style={{ height: '100%' }}>
    <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
      {props.text}
    </Typography.Title>
  </Flex>
);

const CustomSplitter = ({ style, firstPanelContent, secondPanelContent, ...restProps }) => (
  <Splitter style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', ...style }} {...restProps}>
    <Splitter.Panel collapsible min="20%">
      {firstPanelContent}
    </Splitter.Panel>
    <Splitter.Panel collapsible>
      {secondPanelContent}
    </Splitter.Panel>
  </Splitter>
);

export default CustomSplitter;
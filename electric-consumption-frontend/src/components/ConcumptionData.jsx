import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';

const ConsumptionStats = ({ currentValue, lastValue }) => {
  return (
    <Row gutter={16} justify="center" align="middle" style={{ textAlign: 'center' }}>
      <Col span={12}>
        <Card>
          <Statistic 
            title="Consumo Actual"
            value={currentValue}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            suffix=" kW"
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card>
          <Statistic
            title="Última Lectura"
            value={lastValue}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            suffix=" kW"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ConsumptionStats;

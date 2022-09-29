import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Select, Collapse, Input, Spin } from 'antd';
import { formItemLayout, monthArray } from './constant';
import {
  fetchData,
  getRemoveTemperatureInitialValue,
  isValidFloatFunc,
} from './utils';
import LineChart from './chart';
const { Option } = Select;
const { Panel } = Collapse;

const App = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [selectGraphData, setSelectGraphData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [mainForm] = Form.useForm();
  const [addTemperatureForm] = Form.useForm();
  const [removeTemperatureForm] = Form.useForm();

  useEffect(() => {
    fetchData(
      setData,
      setGraphData,
      setLoading,
      setYearData,
      setSelectGraphData,
    );
  }, []);

  const mainFormHandleSubmit = values => {
    let fromYear = values.from_year;
    let toYear = values.to_year;
    let maxYear = fromYear > toYear ? fromYear : toYear;
    let minYear = fromYear < toYear ? fromYear : toYear;
    let years = [minYear, maxYear];
    let fiterGraphData = selectGraphData.filter(item => {
      const year = new Date(item.date).getFullYear();
      return year >= parseInt(years[0]) && year <= parseInt(years[1]);
    });
    setGraphData(fiterGraphData);
  };
  const addTemperatureFormHandleSubmit = values => {
    let obj = { ...graphData[graphData.length - 1] };
    let date = obj.date;
    let d = new Date();
    d.setFullYear(date.getFullYear() + 1);
    setGraphData(preArray => [
      ...preArray,
      {
        date: d,
        value: values.add_temperature,
      },
    ]);
    removeTemperatureForm.setFieldsValue({
      remove_temperature: values.add_temperature,
    });
  };
  const removeTemperatureFormHandleSubmit = async values => {
    let filterArray = graphData.slice(0, graphData.length - 1);
    await setGraphData(filterArray);
    removeTemperatureForm.setFieldsValue({
      remove_temperature: getRemoveTemperatureInitialValue(filterArray),
    });
  };

  return (
    <div className="main-container">
      <Spin tip="Loading..." spinning={loading}>
        {/*main form*/}
        <Form
          name="main-form"
          {...formItemLayout}
          layout="vertical"
          form={mainForm}
          requiredMark={false}
          initialValues={{}}
          onFinish={mainFormHandleSubmit}
        >
          <Row gutter={20} className="main-row-padding">
            <Col md={4} xs={24}>
              <Form.Item name="from_year" label="From:">
                <Select placeholder="Select..." style={{ width: '100%' }}>
                  {yearData.map(item => (
                    <Option key={item.year} value={item.year}>
                      {item.year}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={4} xs={24}>
              <Form.Item name="from_month" label=" ">
                <Select placeholder="Select..." style={{ width: '100%' }}>
                  {monthArray.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={4} xs={24}>
              <Form.Item name="to_year" label="To:">
                <Select placeholder="Select..." style={{ width: '100%' }}>
                  {yearData.map(item => (
                    <Option key={item.year} value={item.year}>
                      {item.year}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={4} xs={24}>
              <Form.Item name="to_month" label=" ">
                <Select placeholder="Select..." style={{ width: '100%' }}>
                  {monthArray.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={8} xs={24} className="reset-button-margin">
              <Button
                type="primary"
                onClick={() => mainForm.resetFields()}
                style={{ marginRight: 15 }}
              >
                Reset Dates
              </Button>
              <Button type="primary" htmlType="submit">
                Select
              </Button>
            </Col>
          </Row>
        </Form>
        {/*chart*/}
        <Row style={{ marginTop: 20 }}>
          <Col span={24}>
            <div className="main-graph-container">
              <div className="main-graph-heading">
                {data?.description?.title}
              </div>
              <LineChart
                graphData={graphData || []}
                loading={loading}
                units={data?.description?.units}
              />
            </div>
          </Col>
        </Row>
        {/*add temperature*/}
        <Row className="main-row-padding" style={{ marginTop: 20 }}>
          <Col xs={24}>
            <Collapse accordion>
              <Panel header="Add Temperature Value" key="1">
                <Form
                  name="add-temperature-form"
                  {...formItemLayout}
                  layout="vertical"
                  form={addTemperatureForm}
                  requiredMark={false}
                  initialValues={{}}
                  onFinish={addTemperatureFormHandleSubmit}
                >
                  <Row>
                    <Col md={6} xs={24}>
                      <Form.Item
                        name="add_temperature"
                        label="Temperature"
                        rules={[
                          () => ({
                            validator(_, value) {
                              if (value) {
                                if (!isValidFloatFunc(value)) {
                                  return Promise.reject(
                                    'Enter only in integer',
                                  );
                                }
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <Input placeholder="Enter" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6}>
                      <Button type="primary" htmlType={'submit'}>
                        Add
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Panel>
              <Panel header="Remove Last Temperature Value" key="2">
                <Form
                  name="remove-temperature-form"
                  {...formItemLayout}
                  layout="vertical"
                  form={removeTemperatureForm}
                  requiredMark={false}
                  initialValues={{
                    remove_temperature:
                      getRemoveTemperatureInitialValue(graphData),
                  }}
                  onFinish={removeTemperatureFormHandleSubmit}
                >
                  <Row>
                    <Col md={6} xs={24}>
                      <Form.Item name="remove_temperature" label="Last value">
                        <Input placeholder="Enter" disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6}>
                      <Button type="default" htmlType={'submit'}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default App;

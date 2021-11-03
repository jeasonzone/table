import { mount } from '@vue/test-utils'
import { TestTable } from '../table'

describe('Table', () => {
  const TableMount = options => mount(TestTable, options)

  const columns = [{label: '孩子', value: "child"}, {label: '年龄', value: "age"}];
  const columnsAlign = [{label: '孩子', value: "child", align: 'center'}, {label: '年龄', value: "age"}];
  const rowsData = [
    { child: "小明", age: 3 },
    { child: "小黄", age: 1 },
    { child: "小亮", age: 2 },
    { child: "小红", age: 4 },
    { child: "小橙", age: 5 },
    { child: "小绿", age: 6 },
    { child: "小白", age: 7 },
    { child: "小青", age: 8 },
    { child: "小蓝", age: 33 },
    { child: "小紫", age: 5 },
    { child: "小丑", age: 7 },
    { child: "小九", age: 9 },
    { child: "小七", age: 7 },
    { child: "小八", age: 77 },
    { child: "小鬼", age: 3 },
    { child: "小狗", age: 22 },
  ];

  // const itif = (condition) => condition ? it : it.skip;

  test('render', () => {
    const wrapper = TableMount()
    expect(wrapper.html()).toMatchSnapshot()
    expect(() => {
      wrapper.vm.$forceUpdate()
      wrapper.vm.$destroy()
    }).not.toThrow()
  })

  test('基础使用展示', async () => {
    const wrapper = TableMount({
      propsData: {
        rowsData: rowsData,
        columns: columns
      },
    })

    // 常规状态dom测试
    expect(wrapper.find('.jeason-table').exists()).toBe(true);  // 整体表格
    expect(wrapper.find('.jeason-table-header').exists()).toBe(true);  // 表格头部
    expect(wrapper.find('.jeason-table-body').exists()).toBe(true);    // 表格内容
    expect(wrapper.find('.jeason-table-footer').exists()).toBe(true);  // 表格底部
  })


  test('点击升降序', async () => {
    const wrapper = TableMount({
      propsData: {
        rowsData: rowsData,
        columns: columns
      },
    })

    const jeasonTableHeadDom = wrapper.find('.jeason-table-th');
    await jeasonTableHeadDom.trigger('click');
    expect(wrapper.find('.dsc').exists()).toBe(true);  // 当前是否处于对应单元格降序排列

    await jeasonTableHeadDom.trigger('click');
    expect(wrapper.find('.asc').exists()).toBe(true);  // 当前是否处于对应单元格升序排列

    await jeasonTableHeadDom.trigger('click');
    expect(wrapper.find('.asc').exists()).not.toBe(true);  // 当前是否处于默认初始顺序
    expect(wrapper.find('.dsc').exists()).not.toBe(true);  // 当前是否处于默认初始顺序
  })

  test('配置不展示表头', async () => {
    const wrapper = TableMount({
      propsData: {
        rowsData: rowsData,
        columns: columns,
        tableSize: 'easy'
      },
    })

    expect(wrapper.find('.jeason-table-header').exists()).not.toBe(true);  // 隐藏表格头部
    expect(wrapper.find('.jeason-table-body').exists()).toBe(true);  // 展示表格内容
    expect(wrapper.find('.jeason-table-footer').exists()).toBe(true);  // 展示表格尾部分页
  })

  test('配置不展示分页', async () => {
    const wrapper = TableMount({
      propsData: {
        rowsData: rowsData,
        columns: columns,
        isShowPaging: false
      },
    })

    expect(wrapper.find('.jeason-table-header').exists()).toBe(true);  // 展示表格头部
    expect(wrapper.find('.jeason-table-body').exists()).toBe(true);  // 展示表格内容
    expect(wrapper.find('.jeason-table-footer').exists()).not.toBe(true);  // 隐藏表格尾部分页
  })

  test('配置居中对齐', async () => {
    const wrapper = TableMount({
      propsData: {
        rowsData: rowsData,
        columns: columnsAlign
      },
    })

    expect(wrapper.find('.jeason-table-th').element.style.textAlign).toBe('center');
    setTimeout(() => {
      expect(wrapper.find('.jeason-table-td').element.style.textAlign).toBe('center');
    }, 1500);
  })
})

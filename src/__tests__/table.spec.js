import { mount } from '@vue/test-utils'
import { delay } from 'lodash';
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

    delayFn(() => {
      expect(wrapper.find('.paging-input').value).toBe(1);
    });
    
    delayFn(expect(wrapper.vm.getData()).toEqual([{"age": 3, "child": "小明"}, {"age": 1, "child": "小黄"}, {"age": 2, "child": "小亮"}, {"age": 4, "child": "小红"}, {"age": 5, "child": "小橙"}, {"age": 6, "child": "小绿"}, {"age": 7, "child": "小白"}, {"age": 8, "child": "小青"}, {"age": 33, "child": "小蓝"}, {"age": 5, "child": "小紫"}]));
  })

  test('点击上/下一页', async () => {
    const wrapper = TableMount({
      propsData: {
        rowsData: rowsData,
        columns: columns
      },
    })

    function fnCheckPagingInit () {
      expect(wrapper.find('.paging-input').value).toBe(1);
    }
    
    delayFn(fnCheckPagingInit);

    const jeasonTablePagingAft = wrapper.find('.aft-btn');
    await jeasonTablePagingAft.trigger('click');

    function fnCheckPagingNext () {
      expect(wrapper.find('.paging-input').value).toBe(2);
    }

    delayFn(fnCheckPagingNext);

    const jeasonTablePagingPre = wrapper.find('.pre-btn');
    await jeasonTablePagingPre.trigger('click');

    function fnCheckPagingReturn () {
      expect(wrapper.find('.paging-input').value).toBe(1);
    }

    delayFn(fnCheckPagingReturn);     
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
    delayFn(expect(wrapper.find('.jeason-table-td').element.style.textAlign).toBe('center'));
  })

  test('修改页面表格规格', async () => {
    const wrapper = TableMount({
      propsData: {
        rowsData: rowsData,
        columns: columns
      },
    })

    const jeasonTableSelect = wrapper.find('.select-trigger');
    const jeasonTableSelectItem = wrapper.find('.select-item-5');
    const fn1 = async () => {
      await jeasonTableSelect.trigger('click');
      await jeasonTableSelectItem.trigger('click');
      await jeasonTableSelect.trigger('change');
      
      delayFn(function cb () {
        expect(wrapper.vm.getData()).toEqual([{"age": 3, "child": "小明"}, {"age": 1, "child": "小黄"}, {"age": 2, "child": "小亮"}, {"age": 4, "child": "小红"}, {"age": 5, "child": "小橙"}])
      });
    };

    fn1();
  })

  test('调用修改页面表格规格函数', async () => {
    const wrapper = TableMount({
      propsData: {
        rowsData: rowsData,
        columns: columns
      },
    })
    wrapper.vm.changePageSize(5);
    delayFn(() => {
      expect(wrapper.vm.getData()).toEqual([{"age": 3, "child": "小明"}, {"age": 1, "child": "小黄"}, {"age": 2, "child": "小亮"}, {"age": 4, "child": "小红"}, {"age": 5, "child": "小橙"}])
    });
  })
  
  test('跳转到第2页', async () => {
    const wrapper = TableMount({
      propsData: {
        rowsData: rowsData,
        columns: columns
      },
    })
    const jeasonPagingVal= wrapper.find('.paging-input');
    jeasonPagingVal.setValue('2');
    jeasonPagingVal.trigger('keyup.enter');
    delayFn(() => {
      expect(jeasonPagingVal.value).toBe('2')
      expect(wrapper.vm.getData()).toEqual([{ child: "小丑", age: 7 },
      { child: "小九", age: 9 },
      { child: "小七", age: 7 },
      { child: "小八", age: 77 },
      { child: "小鬼", age: 3 },
      { child: "小狗", age: 22 }]);
    });
  })
})

function delayFn (cb) {
  return new Promise(resolve => {
    delay(cb, 1500);
    resolve();
  });
}

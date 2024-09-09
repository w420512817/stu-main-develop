<template>
  <basic-modal
    v-bind="$attrs"
    :title="title"
    class="w-600px"
    :mask-closable="false"
    @register="register"
    @ok="handleSubmit"
    @visible-change="visibleChange"
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="state"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        label-align="right"
        require-mark-placement="left"
        :style="{
          maxWidth: '640px'
        }"
      >
        <!-- 产品要求：无法给业务机构创建角色，所以注释掉 2023-04-18 -->
        <!-- <n-form-item v-if="userOrgType === 'CONSOLE'" label="机构名称:" path="orgId">
          <n-select
            v-model:value="state.orgId"
            :options="orgOptions"
            placeholder="请选择所属机构"
            clearable
            label-field="orgName"
            value-field="id"
            filterable
          />
        </n-form-item> -->
        <n-form-item label="角色名称：" path="roleName">
          <n-input
            v-model:value="state.roleName"
            :readonly="isDetail"
            show-count
            maxlength="20"
            placeholder="请输入角色名称"
          />
        </n-form-item>
        <n-form-item label="备注：">
          <n-input
            v-model:value="state.remark"
            :readonly="isDetail"
            type="textarea"
            placeholder="请输入"
            show-count
            maxlength="50"
            :autosize="{
              minRows: 2
            }"
          />
        </n-form-item>

        <n-form-item v-show="!isDetail" label=" " :show-feedback="false" pl-6>
          <n-checkbox :checked="checked" :indeterminate="indeterminate" @click="allSelect"> 全选 </n-checkbox>
        </n-form-item>

        <n-form-item ref="perFItemRef" label="权限：" path="permissonList">
          <div class="w-full overflow-auto">
            <n-tree
              v-model:checked-keys="state.permissonList"
              v-model:indeterminate-keys="state.yuXuan"
              :data="permissonList"
              key-field="id"
              label-field="name"
              h-300px
              block-line
              cascade
              checkable
              default-expand-all
              check-on-click
              virtual-scroll
            />
          </div>
        </n-form-item>
      </n-form>
    </n-space>
  </basic-modal>
</template>

<script setup>
import { reactive, ref, computed, nextTick, onMounted, watch } from 'vue';
import { useModalInner } from '@common/components/custom/Modal';
import { useUserStore } from '@/store';

// import { getAllOrgSelectBox } from '@/api/systemManage/account';
import { GetCurrentRoles, AddRole, UpdateRule, SchoolMenu } from '@/api/systemManage/role';
import { AC_ADD, AC_DETAILS, AC_EDIT } from '@common/enum/pageEnum';
import { createRules } from '../table.data';

const emits = defineEmits(['onSuccess', 'register']);

const {
  userInfo: { orgId, id },
  userOrgType
} = useUserStore();
const [register, { closeModal, changeLoading }] = useModalInner(data => {
  console.log(data, 'data888');
  setModalTitle(data);
  data.key !== AC_ADD && onDataReceive(data);
});

const initForm = {
  orgId: null,
  roleName: null,
  remark: null,
  permissonList: null,
  yuXuan: [],
  type: userOrgType === 'CONSOLE' ? 2 : 4, // 运维角色传2， 其他业务传4
  id: null
};
let allNode = [];
let t = '';
const title = ref('');

// const orgOptions = ref([]);

const formRef = ref(null);
const perFItemRef = ref();

const state = reactive({ ...initForm });
const rules = createRules(state);
const permissonList = ref([]);

const operation = ref('');
const isAdd = computed(() => operation.value === AC_ADD);
const isDetail = computed(() => operation.value === AC_DETAILS);
const checked = computed(() => {
  return state.permissonList?.length === allNode.length;
});
const indeterminate = computed(() => {
  return !!state.permissonList?.length && !checked.value;
});

async function visibleChange(visible) {
  await nextTick();
  visible && !isAdd.value ? '' : resetForm();
}

async function onDataReceive({ row }) {
  changeLoading();
  const res = await GetCurrentRoles({ roleId: row.id });
  let { indeterminate, checked } = shaixuan(permissonList.value, res);
  Object.assign(state, { ...row, roleName: row.name, roleId: row.id, permissonList: checked, yuXuan: indeterminate });
  changeLoading(false);
}
function setModalTitle({ key }) {
  operation.value = key;
  t = key === AC_EDIT ? '编辑' : key === AC_ADD ? '新增' : '查看';
  title.value = t + '角色';
}

function allSelect() {
  if (checked.value) {
    state.permissonList = [];
    state.yuXuan = [];
    perFItemRef.value.validate();
    return;
  }
  state.permissonList = allNode;
  perFItemRef.value.validate();
}

function resetForm() {
  Object.assign(state, initForm);
}

function handleSubmit() {
  if (isDetail.value) {
    closeModal();
    return;
  }
  formRef.value.validate(async err => {
    if (!err) {
      changeLoading(true);
      const funcApi = isAdd.value ? AddRole : UpdateRule;
      try {
        let { yuXuan, permissonList } = state;
        await funcApi({ ...state, orgId, permissonList: yuXuan.concat(permissonList) });
        closeModal();
        window.$message.success(t + '成功');
        emits('onSuccess');
      } finally {
        changeLoading(false);
      }
    }
  });
}

watch(isDetail, () => {
  function disabledCheck(arr) {
    arr.forEach(item => {
      item.disabled = isDetail.value;
      if (item?.children?.length) {
        disabledCheck(item.children);
      }
    });
    return arr;
  }
  return disabledCheck(permissonList.value);
});

function shaixuan(treeArr, target) {
  let checked = [],
    indeterminate = [];
  let flag = 0;
  for (let i = 0; i < treeArr.length; i++) {
    let node = treeArr[i],
      children = node.children,
      len = children?.length;
    if (len) {
      let childrenRes = shaixuan(children, target);
      indeterminate = indeterminate.concat(childrenRes.indeterminate);
      checked = checked.concat(childrenRes.checked);
      if (childrenRes.flag === len) {
        flag++;
        checked.push(node.id);
      } else if (childrenRes.flag !== 0) {
        indeterminate.push(node.id);
      }
    } else {
      let isCon = false;
      for (let j = 0; j < target.length; j++) {
        const id = target[j];
        if (id === node.id) {
          target.splice(j, 1);
          flag++;
          isCon = true;
          break;
        }
      }
      isCon && checked.push(node.id);
    }
  }
  return { checked, indeterminate, flag };
}

function getNodeValue() {
  allNode = [];
  let list = [...permissonList.value];
  for (let i = 0; i < list.length; i++) {
    let node = list[i];
    allNode.push(node.id);
    if (node.children) list.push(...node.children);
  }
}

onMounted(async () => {
  const res = await SchoolMenu({ userId: id });
  permissonList.value = res;
  getNodeValue();
  // if (userOrgType === 'CONSOLE') {
  //   orgOptions.value = await getAllOrgSelectBox({ orgName: '' });
  // }

  // console.log(useUserStore().userInfo);
});
</script>

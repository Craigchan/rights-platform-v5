<template>
  <div class="address-management-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">地址管理</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- 地址列表 -->
    <div class="address-list-container">
      <div v-if="addressList.length > 0" class="address-list">
        <div 
          v-for="address in addressList" 
          :key="address.id"
          class="address-card"
          :class="{ 'is-default': address.isDefault }"
        >
          <!-- 默认标签 -->
          <div v-if="address.isDefault" class="default-badge">
            <CheckCircleFilled />
            <span>默认地址</span>
          </div>

          <!-- 地址信息 -->
          <div class="address-info">
            <div class="address-header">
              <div class="user-info">
                <span class="user-name">{{ address.name }}</span>
                <span class="user-phone">{{ address.phone }}</span>
              </div>
              <div class="address-tags">
                <a-tag v-if="address.tag" color="orange">{{ address.tag }}</a-tag>
              </div>
            </div>
            
            <div class="address-detail">
              <EnvironmentOutlined class="location-icon" />
              <div class="address-text">
                <div class="address-region">{{ address.province }} {{ address.city }} {{ address.district }}</div>
                <div class="address-street">{{ address.street }}</div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="address-actions">
            <div class="action-left">
              <a-button 
                type="text" 
                size="small"
                @click="handleSetDefault(address)"
                :disabled="address.isDefault"
              >
                {{ address.isDefault ? '默认地址' : '设为默认' }}
              </a-button>
            </div>
            <div class="action-right">
              <a-button 
                type="text" 
                size="small"
                @click="handleEdit(address)"
              >
                <EditOutlined />
                编辑
              </a-button>
              <a-button 
                type="text" 
                size="small"
                danger
                @click="handleDelete(address)"
              >
                <DeleteOutlined />
                删除
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <EnvironmentOutlined class="empty-icon" />
        <div class="empty-text">暂无收货地址</div>
        <div class="empty-tip">添加收货地址后,下单更便捷</div>
      </div>
    </div>

    <!-- 添加地址按钮 -->
    <div class="add-address-btn-container">
      <a-button 
        type="primary" 
        size="large" 
        block
        @click="handleAdd"
      >
        <PlusOutlined />
        添加新地址
      </a-button>
    </div>

    <!-- 地址表单弹窗 -->
    <a-modal
      v-model:open="showAddressForm"
      :title="formMode === 'add' ? '添加地址' : '编辑地址'"
      :width="400"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <a-form-item label="收货人" name="name">
          <a-input 
            v-model:value="formData.name" 
            placeholder="请输入收货人姓名"
            :maxlength="20"
          />
        </a-form-item>

        <a-form-item label="手机号码" name="phone">
          <a-input 
            v-model:value="formData.phone" 
            placeholder="请输入手机号码"
            :maxlength="11"
          />
        </a-form-item>

        <a-form-item label="所在地区" name="region">
          <a-cascader
            v-model:value="formData.region"
            :options="regionOptions"
            placeholder="请选择省市区"
            :show-search="{ filter }"
          />
        </a-form-item>

        <a-form-item label="详细地址" name="street">
          <a-textarea
            v-model:value="formData.street"
            placeholder="请输入详细地址,如街道、楼栋号、单元室等"
            :rows="3"
            :maxlength="100"
            show-count
          />
        </a-form-item>

        <a-form-item label="地址标签" name="tag">
          <a-radio-group v-model:value="formData.tag">
            <a-radio-button value="家">家</a-radio-button>
            <a-radio-button value="公司">公司</a-radio-button>
            <a-radio-button value="学校">学校</a-radio-button>
            <a-radio-button value="">其他</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item name="isDefault">
          <a-checkbox v-model:checked="formData.isDefault">
            设为默认地址
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <div class="form-actions">
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="submitting">
              {{ formMode === 'add' ? '添加' : '保存' }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 删除确认弹窗 -->
    <a-modal
      v-model:open="showDeleteConfirm"
      title="删除地址"
      :width="350"
      @ok="confirmDelete"
      @cancel="showDeleteConfirm = false"
    >
      <p>确定要删除这个收货地址吗?</p>
      <p class="delete-tip">删除后将无法恢复</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 地址列表数据
const addressList = ref([
  {
    id: 1,
    name: '张三',
    phone: '138****5678',
    province: '江苏省',
    city: '南京市',
    district: '鼓楼区',
    street: '中山路18号德基广场1栋2单元301室',
    tag: '家',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '139****1234',
    province: '江苏省',
    city: '南京市',
    district: '玄武区',
    street: '珠江路88号新世界中心A座15楼',
    tag: '公司',
    isDefault: false
  },
  {
    id: 3,
    name: '王五',
    phone: '137****9876',
    province: '江苏省',
    city: '南京市',
    district: '栖霞区',
    street: '仙林大道163号南京大学仙林校区',
    tag: '学校',
    isDefault: false
  }
])

// 表单相关
const showAddressForm = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const formRef = ref()
const submitting = ref(false)
const currentEditId = ref<number | null>(null)

const formData = reactive({
  name: '',
  phone: '',
  region: [] as string[],
  street: '',
  tag: '家',
  isDefault: false
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请选择所在地区', trigger: 'change', type: 'array' }
  ],
  street: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 100, message: '详细地址长度为5-100个字符', trigger: 'blur' }
  ]
}

// 地区选择器数据(简化版,实际应该使用完整的省市区数据)
const regionOptions = [
  {
    value: '江苏省',
    label: '江苏省',
    children: [
      {
        value: '南京市',
        label: '南京市',
        children: [
          { value: '鼓楼区', label: '鼓楼区' },
          { value: '玄武区', label: '玄武区' },
          { value: '秦淮区', label: '秦淮区' },
          { value: '建邺区', label: '建邺区' },
          { value: '栖霞区', label: '栖霞区' },
          { value: '雨花台区', label: '雨花台区' },
          { value: '浦口区', label: '浦口区' },
          { value: '江宁区', label: '江宁区' }
        ]
      },
      {
        value: '苏州市',
        label: '苏州市',
        children: [
          { value: '姑苏区', label: '姑苏区' },
          { value: '吴中区', label: '吴中区' },
          { value: '相城区', label: '相城区' },
          { value: '虎丘区', label: '虎丘区' }
        ]
      }
    ]
  },
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      {
        value: '杭州市',
        label: '杭州市',
        children: [
          { value: '西湖区', label: '西湖区' },
          { value: '上城区', label: '上城区' },
          { value: '拱墅区', label: '拱墅区' },
          { value: '滨江区', label: '滨江区' }
        ]
      }
    ]
  }
]

// 地区搜索过滤
const filter = (inputValue: string, path: any[]) => {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
}

// 删除确认相关
const showDeleteConfirm = ref(false)
const deleteTargetId = ref<number | null>(null)

// 返回上一页
const goBack = () => {
  router.back()
}

// 添加地址
const handleAdd = () => {
  formMode.value = 'add'
  currentEditId.value = null
  resetForm()
  showAddressForm.value = true
}

// 编辑地址
const handleEdit = (address: any) => {
  formMode.value = 'edit'
  currentEditId.value = address.id
  
  // 填充表单数据
  formData.name = address.name
  formData.phone = address.phone
  formData.region = [address.province, address.city, address.district]
  formData.street = address.street
  formData.tag = address.tag || ''
  formData.isDefault = address.isDefault
  
  showAddressForm.value = true
}

// 删除地址
const handleDelete = (address: any) => {
  if (address.isDefault) {
    message.warning('默认地址不能删除,请先设置其他地址为默认地址')
    return
  }
  deleteTargetId.value = address.id
  showDeleteConfirm.value = true
}

// 确认删除
const confirmDelete = () => {
  const index = addressList.value.findIndex(addr => addr.id === deleteTargetId.value)
  if (index > -1) {
    addressList.value.splice(index, 1)
    message.success('地址删除成功')
  }
  showDeleteConfirm.value = false
  deleteTargetId.value = null
}

// 设置默认地址
const handleSetDefault = (address: any) => {
  if (address.isDefault) return
  
  // 取消其他默认地址
  addressList.value.forEach(addr => {
    addr.isDefault = false
  })
  
  // 设置当前地址为默认
  const target = addressList.value.find(addr => addr.id === address.id)
  if (target) {
    target.isDefault = true
    message.success('已设置为默认地址')
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    submitting.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const [province, city, district] = formData.region
    
    if (formMode.value === 'add') {
      // 添加新地址
      const newAddress = {
        id: Date.now(),
        name: formData.name,
        phone: formData.phone,
        province,
        city,
        district,
        street: formData.street,
        tag: formData.tag,
        isDefault: formData.isDefault
      }
      
      // 如果设置为默认,取消其他默认地址
      if (formData.isDefault) {
        addressList.value.forEach(addr => {
          addr.isDefault = false
        })
      }
      
      addressList.value.unshift(newAddress)
      message.success('地址添加成功')
    } else {
      // 编辑地址
      const target = addressList.value.find(addr => addr.id === currentEditId.value)
      if (target) {
        target.name = formData.name
        target.phone = formData.phone
        target.province = province
        target.city = city
        target.district = district
        target.street = formData.street
        target.tag = formData.tag
        
        // 如果设置为默认,取消其他默认地址
        if (formData.isDefault && !target.isDefault) {
          addressList.value.forEach(addr => {
            addr.isDefault = false
          })
          target.isDefault = true
        }
        
        message.success('地址修改成功')
      }
    }
    
    showAddressForm.value = false
    resetForm()
  } catch (error) {
    message.error('操作失败,请重试')
  } finally {
    submitting.value = false
  }
}

// 取消表单
const handleCancel = () => {
  showAddressForm.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.phone = ''
  formData.region = []
  formData.street = ''
  formData.tag = '家'
  formData.isDefault = false
  formRef.value?.resetFields()
}
</script>

<style scoped>
.address-management-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-icon {
  font-size: 20px;
  color: #333;
  cursor: pointer;
}

.page-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.header-placeholder {
  width: 20px;
}

/* 地址列表容器 */
.address-list-container {
  padding: 12px 16px;
  min-height: calc(100vh - 200px);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 地址卡片 */
.address-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s;
}

.address-card.is-default {
  border: 1px solid #FF6B35;
}

.address-card:active {
  transform: scale(0.98);
}

/* 默认标签 */
.default-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: #fff;
  padding: 4px 12px;
  border-radius: 0 12px 0 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 地址信息 */
.address-info {
  margin-bottom: 12px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.user-phone {
  font-size: 14px;
  color: #666;
}

.address-detail {
  display: flex;
  gap: 8px;
}

.location-icon {
  font-size: 16px;
  color: #FF6B35;
  margin-top: 2px;
  flex-shrink: 0;
}

.address-text {
  flex: 1;
}

.address-region {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.address-street {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
}

/* 操作按钮 */
.address-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.action-left {
  display: flex;
  gap: 8px;
}

.action-right {
  display: flex;
  gap: 8px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 80px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.empty-tip {
  font-size: 14px;
  color: #999;
}

/* 添加地址按钮 */
.add-address-btn-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.form-actions .ant-btn {
  min-width: 80px;
}

/* 删除提示 */
.delete-tip {
  color: #999;
  font-size: 13px;
  margin-top: 8px;
  margin-bottom: 0;
}

/* 响应式 */
@media (min-width: 768px) {
  .address-management-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>


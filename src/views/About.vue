<template>
  <div class="about-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">关于我们</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- Logo和版本信息 -->
    <div class="app-info-card">
      <div class="app-logo">
        <GiftOutlined />
      </div>
      <div class="app-name">权益平台</div>
      <div class="app-slogan">让生活更有价值</div>
      <div class="app-version">版本 v3.0.0</div>
      <a-button type="primary" @click="checkUpdate">
        检查更新
      </a-button>
    </div>

    <!-- 平台介绍 -->
    <div class="section-card">
      <div class="section-header">
        <InfoCircleOutlined class="section-icon" />
        <span class="section-title">平台介绍</span>
      </div>
      <div class="section-content">
        <p>权益平台是一个集优惠券、积分兑换、政府活动于一体的综合性消费权益服务平台。</p>
        <p>我们致力于为用户提供最优质的消费体验,让每一次消费都能享受到实实在在的优惠和权益。</p>
        <p>平台汇聚了众多优质商家和品牌,涵盖美食、购物、娱乐、生活服务等多个领域,为用户打造一站式消费权益服务。</p>
      </div>
    </div>

    <!-- 核心功能 -->
    <div class="section-card">
      <div class="section-header">
        <StarOutlined class="section-icon" />
        <span class="section-title">核心功能</span>
      </div>
      <div class="feature-list">
        <div class="feature-item">
          <div class="feature-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <GiftOutlined />
          </div>
          <div class="feature-info">
            <div class="feature-name">优惠券中心</div>
            <div class="feature-desc">海量优惠券免费领取</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <ShoppingOutlined />
          </div>
          <div class="feature-info">
            <div class="feature-name">积分商城</div>
            <div class="feature-desc">积分兑换精品好物</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <TrophyOutlined />
          </div>
          <div class="feature-info">
            <div class="feature-name">玩赚积分</div>
            <div class="feature-desc">签到抽奖赢积分</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <EnvironmentOutlined />
          </div>
          <div class="feature-info">
            <div class="feature-name">政府活动</div>
            <div class="feature-desc">惠民政策一键参与</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系我们 -->
    <div class="section-card">
      <div class="section-header">
        <PhoneOutlined class="section-icon" />
        <span class="section-title">联系我们</span>
      </div>
      <div class="contact-list">
        <div class="contact-item">
          <div class="contact-label">客服热线</div>
          <div class="contact-value">400-123-4567</div>
          <a-button size="small" @click="callPhone">拨打</a-button>
        </div>
        <div class="contact-item">
          <div class="contact-label">客服邮箱</div>
          <div class="contact-value">service@rights-platform.com</div>
          <a-button size="small" @click="sendEmail">发送</a-button>
        </div>
        <div class="contact-item">
          <div class="contact-label">官方网站</div>
          <div class="contact-value">www.rights-platform.com</div>
          <a-button size="small" @click="openWebsite">访问</a-button>
        </div>
        <div class="contact-item">
          <div class="contact-label">公司地址</div>
          <div class="contact-value">江苏省南京市建邺区江东中路123号</div>
          <a-button size="small" @click="viewMap">地图</a-button>
        </div>
      </div>
    </div>

    <!-- 关注我们 -->
    <div class="section-card">
      <div class="section-header">
        <WechatOutlined class="section-icon" />
        <span class="section-title">关注我们</span>
      </div>
      <div class="social-list">
        <div class="social-item" @click="followWechat">
          <div class="social-icon wechat">
            <WechatOutlined />
          </div>
          <div class="social-name">微信公众号</div>
        </div>
        <div class="social-item" @click="followWeibo">
          <div class="social-icon weibo">
            <WeiboOutlined />
          </div>
          <div class="social-name">官方微博</div>
        </div>
        <div class="social-item" @click="joinQQ">
          <div class="social-icon qq">
            <QqOutlined />
          </div>
          <div class="social-name">QQ交流群</div>
        </div>
      </div>
    </div>

    <!-- 法律信息 -->
    <div class="section-card">
      <div class="section-header">
        <FileTextOutlined class="section-icon" />
        <span class="section-title">法律信息</span>
      </div>
      <div class="legal-list">
        <div class="legal-item" @click="viewPrivacyPolicy">
          <span>隐私政策</span>
          <RightOutlined />
        </div>
        <div class="legal-item" @click="viewUserAgreement">
          <span>用户协议</span>
          <RightOutlined />
        </div>
        <div class="legal-item" @click="viewCopyright">
          <span>版权声明</span>
          <RightOutlined />
        </div>
      </div>
    </div>

    <!-- 底部版权 -->
    <div class="copyright">
      <div class="copyright-text">© 2025 权益平台 All Rights Reserved</div>
      <div class="copyright-text">苏ICP备12345678号</div>
      <div class="copyright-text">江苏权益科技有限公司</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  LeftOutlined,
  GiftOutlined,
  InfoCircleOutlined,
  StarOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  FileTextOutlined,
  RightOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 检查更新
const checkUpdate = () => {
  message.loading('正在检查更新...', 1).then(() => {
    message.success('当前已是最新版本')
  })
}

// 拨打电话
const callPhone = () => {
  Modal.confirm({
    title: '拨打客服电话',
    content: '400-123-4567',
    okText: '拨打',
    onOk: () => {
      message.success('正在拨打...')
    }
  })
}

// 发送邮件
const sendEmail = () => {
  message.info('打开邮件客户端')
}

// 打开网站
const openWebsite = () => {
  message.info('打开官方网站')
}

// 查看地图
const viewMap = () => {
  message.info('打开地图查看位置')
}

// 关注微信
const followWechat = () => {
  Modal.info({
    title: '关注微信公众号',
    content: '搜索"权益平台"或扫描二维码关注',
    okText: '知道了'
  })
}

// 关注微博
const followWeibo = () => {
  message.info('打开微博关注')
}

// 加入QQ群
const joinQQ = () => {
  Modal.info({
    title: '加入QQ交流群',
    content: '群号: 123456789',
    okText: '知道了'
  })
}

// 查看隐私政策
const viewPrivacyPolicy = () => {
  message.info('查看隐私政策')
}

// 查看用户协议
const viewUserAgreement = () => {
  message.info('查看用户协议')
}

// 查看版权声明
const viewCopyright = () => {
  message.info('查看版权声明')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
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

/* App信息卡片 */
.app-info-card {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  margin: 12px 16px;
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  color: #fff;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.app-logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 16px;
  backdrop-filter: blur(10px);
}

.app-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.app-slogan {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.app-version {
  font-size: 13px;
  opacity: 0.8;
  margin-bottom: 20px;
}

/* 区块卡片 */
.section-card {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 18px;
  color: #FF6B35;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.section-content {
  padding: 16px;
  line-height: 1.8;
  color: #666;
  font-size: 14px;
}

.section-content p {
  margin-bottom: 12px;
}

.section-content p:last-child {
  margin-bottom: 0;
}

/* 功能列表 */
.feature-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  flex-shrink: 0;
}

.feature-info {
  flex: 1;
}

.feature-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 13px;
  color: #999;
}

/* 联系列表 */
.contact-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-label {
  font-size: 14px;
  color: #999;
  width: 70px;
  flex-shrink: 0;
}

.contact-value {
  flex: 1;
  font-size: 14px;
  color: #333;
  word-break: break-all;
}

/* 社交列表 */
.social-list {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.social-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.social-item:active {
  transform: scale(0.95);
}

.social-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.social-icon.wechat {
  background: #07c160;
}

.social-icon.weibo {
  background: #ff8200;
}

.social-icon.qq {
  background: #12b7f5;
}

.social-name {
  font-size: 13px;
  color: #666;
}

/* 法律列表 */
.legal-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.legal-item:active {
  transform: scale(0.98);
}

/* 版权信息 */
.copyright {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 12px;
}

.copyright-text {
  margin-bottom: 4px;
}

/* 响应式 */
@media (min-width: 768px) {
  .about-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>


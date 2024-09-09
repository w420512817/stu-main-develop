<template>
  <div>
    <div class="st1">
      <div class="st1-title">新疆利明眼科儿童青少年近视防控工程</div>
      <div class="st1-subTit">近视防控信息卡</div>
      <div class="st1-stuCode">
        <slot name="stuCode"></slot>
      </div>
      <table v-if="props.studata" border="1">
        <tr>
          <td>姓名</td>
          <td>{{ props.studata.studentName }}</td>
          <td>性别</td>
          <td>{{ props.studata.sex }}</td>
        </tr>
        <tr>
          <td>学校</td>
          <td>{{ props.studata.orgName }}</td>
          <td>年级</td>
          <td>{{ props.studata.gradeName }}</td>
        </tr>
        <tr>
          <td>班级</td>
          <td>{{ props.studata.className }}</td>
          <td>出生日期</td>
          <td>{{ props.studata.birth }}</td>
        </tr>
      </table>
      <div class="st1-direction">
        近年来，儿童青少年近视呈低龄、高发姿态，危及人民体质健康和国家安全。近视无法治愈，但采取科学措施，能够有效预防近视发生、控制近视发展。在中小学生免费视力筛查项目，为儿童青少年眼健康保驾护航。
      </div>
      <br /><br /><br />
      <div class="steps">
        <div class="step">学生家长查询流程</div>
        <div class="step">第一步：扫码关注微信公众号【利明眼科近视防控平台】</div>
        <div class="step">第二步：点击公众号菜单【回复信息：视力报告】</div>
        <div class="step">第三步：扫描下方二维码获取学生体检报告</div>
        <div class="st1-stuCode2">
          <slot name="gzhCode"></slot>
        </div>
      </div>
      <div class="st1-line"></div>
      <div class="st1-codeArea">
        <slot name="stuCode"></slot>
        <div class="st1-codeAreas">
          <div class="st1-a-c"><span style="font-size: 30px">←</span>&nbsp;&nbsp;医生扫码筛查</div>
          <div class="st1-a-c"><span style="font-size: 30px">←</span>&nbsp;&nbsp;学生、家长扫码获取体检报告</div>
        </div>
      </div>
      <div class="st1-line"></div>
      <div class="st1-title2">报告结果分析【家长注意】</div>
      <div class="st1-stPar">尊敬的学生家长:</div>
      <div class="st1-stPar2">
        近年来，儿童青少年近视呈低龄、高发姿态，危及人民体质健康和国家安全。近视无法治愈，但采取科学措施，能够有效预防近视发生、控制近视发展。在中小学生免费视力筛查项目，为儿童青少年眼健康保驾护航。
      </div>
    </div>
    <div class="print_line"></div>
  </div>
</template>
<script setup>
const props = defineProps(['studata']);
</script>
<style>
.st1 {
  width: 190mm;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.st1-title {
  width: 100%;
  margin-top: 40px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
.st1-stuCode {
  position: absolute;
  right: 5px;
  top: 5px;
}
.st1-subTit {
  font-size: 14px;
  text-align: center;
  margin-top: 15px;
}
.st1 table,
.st1 table tr th,
.st1 table tr td {
  border: 1px solid #ccc;
}
.st1 table {
  margin: 25px 0;
  width: 180mm;
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
}
.st1-direction {
  font-size: 16px;
  font-weight: bold;
  text-indent: 2em;
}
.steps {
  width: 100%;
  position: relative;
}
.step {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  text-indent: 2em;
  line-height: 30px;
}
.st1-stuCode2 {
  position: absolute;
  right: 0;
  top: 0;
}
.st1-line {
  width: 100%;
  height: 1px;
  border: 1px solid #eee;
  margin: 20px 0;
}
.st1-codeArea {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.st1-codeAreas {
  font-size: 16px;
  font-weight: bold;
  line-height: 30px;
}
.st1-a-c {
  padding-left: 30px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.st1-title2 {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
.st1-stPar {
  width: 100%;
  font-size: 14px;
}
.st1-stPar2 {
  width: 100%;
  font-size: 14px;
  text-indent: 2em;
}
.print_line {
  page-break-after: always;
}
</style>

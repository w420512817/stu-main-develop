<template>
  <div v-for="(healthInformation, i) in healthInfoList" :key="i" :class="{ 'mt-5': i !== 0 }">
    <p class="text-center font-bold mb-3 text-16px relative">
      <span v-if="i == 0">{{ reportTitle }}</span>
      &nbsp;
      <span class="absolute text-14px bottom-0 top-0 mt-auto left-5">
        筛查人员：{{ healthInformation.screenerName || '/' }}，筛查时间：{{ healthInformation.screeningTime || '/' }}
      </span>
    </p>
    <template v-if="state.screeningOptions1.length && healthInformation.eyesight">
      <section v-for="(item, index) in state.screeningOptions1" :key="index" px-5>
        <p class="text-15px font-bold my-3">{{ item.screeningTypeName }}</p>
        <n-grid :cols="3" x-gap="12" y-gap="12">
          <n-gi
            v-for="(subItem, idx) in item.itemList"
            :key="idx"
            :span="subItem.screeningItemCode == 'sl' || subItem.screeningItemCode == 'qg' ? 3 : 1"
          >
            <!--视力-->
            <n-grid v-if="subItem.screeningItemCode == 'sl'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>戴镜类型</p>
                <p>{{ GlassesTypes[healthInformation.eyesight.isGlasses || 0] }}</p>
              </n-gi>
              <n-gi>
                <p>裸眼视力</p>
                <p>
                  左眼：{{ healthInformation.eyesight.osVision }}
                  <br />
                  右眼：{{ healthInformation.eyesight.odVision }}
                </p>
              </n-gi>
              <n-gi>
                <p>戴镜视力</p>
                <p>
                  左眼：{{ healthInformation.eyesight.osEyesight }}
                  <br />
                  右眼：{{ healthInformation.eyesight.odEyesight }}
                </p>
              </n-gi>
              <n-gi>
                <p>戴镜度数</p>
                <p>
                  左眼：{{ healthInformation.eyesight.osGlasses }}
                  <br />
                  右眼：{{ healthInformation.eyesight.odGlasses }}
                </p>
              </n-gi>
            </n-grid>
            <!--屈光筛查项目-->
            <template v-else-if="subItem.screeningItemCode == 'qg'">
              <n-grid :cols="3" x-gap="0" y-gap="12" mb-3>
                <n-gi>
                  <p>球镜度数</p>
                  <p>
                    左眼：{{ healthInformation.eyesight.dpOsSph }}
                    <br />
                    右眼：{{ healthInformation.eyesight.dpOdSph }}
                  </p>
                </n-gi>
                <n-gi>
                  <p>柱镜度数</p>
                  <p>
                    左眼：{{ healthInformation.eyesight.dpOsCyl }}
                    <br />
                    右眼：{{ healthInformation.eyesight.dpOdCyl }}
                  </p>
                </n-gi>
                <n-gi>
                  <p>轴位</p>
                  <p>
                    左眼：{{ healthInformation.eyesight.dpOsAxial }}
                    <br />
                    右眼：{{ healthInformation.eyesight.dpOdAxial }}
                  </p>
                </n-gi>
              </n-grid>
              <n-grid :cols="3" x-gap="0" y-gap="12" mb-3>
                <n-gi>
                  <p>R1</p>
                  <p>
                    左眼：{{ healthInformation.eyesight.orbLeftR1Mm }}mm {{ healthInformation.eyesight.orbLeftR1D }}D
                    <br />
                    右眼：{{ healthInformation.eyesight.orbRightR1Mm }}mm {{ healthInformation.eyesight.orbRightR1D }}D
                  </p>
                </n-gi>
                <n-gi>
                  <p>R2</p>
                  <p>
                    左眼：{{ healthInformation.eyesight.orbLeftR2Mm }}mm
                    {{ healthInformation.eyesight.orbLeftR2D }}D<br />
                    右眼：{{ healthInformation.eyesight.orbRightR2Mm }}mm {{ healthInformation.eyesight.orbRightR2D }}D
                  </p>
                </n-gi>
                <n-gi>
                  <p>AX</p>
                  <p>
                    左眼：{{ healthInformation.eyesight.orbLeftAx }}
                    <br />
                    右眼：{{ healthInformation.eyesight.orbRightAx }}
                  </p>
                </n-gi>
              </n-grid>
            </template>

            <!--其他类型筛查项目-->
            <div v-else>
              <p>{{ subItem.screeningItemCode }}</p>
              <p>{{ subItem.number }}</p>
            </div>
          </n-gi>
        </n-grid>
      </section>
    </template>
    <template v-if="state.screeningOptions2.length && healthInformation.caries">
      <section v-for="(item, index) in state.screeningOptions2" :key="index" px-5>
        <p class="text-15px font-bold my-3">{{ item.screeningTypeName }}</p>
        <n-grid :cols="3" x-gap="12" y-gap="12">
          <n-gi
            v-for="(subItem, idx) in item.itemList"
            :key="idx"
            :span="
              subItem.screeningItemCode == 'yazhou' ||
              subItem.screeningItemCode == 'hengya' ||
              subItem.screeningItemCode == 'quchi'
                ? 3
                : 1
            "
          >
            <n-grid v-if="subItem.screeningItemCode == 'yazhou'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>未见明显异常</p>
                <p>{{ healthInformation.caries.healthyGums || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>牙龈炎</p>
                <p>{{ healthInformation.caries.gingivitis || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>牙石</p>
                <p>{{ healthInformation.caries.tartar || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>深牙周袋</p>
                <p>{{ healthInformation.caries.tartar || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>牙周炎</p>
                <p>{{ healthInformation.caries?.superficialPeriodontalPocket || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>沸斑牙</p>
                <p>{{ healthInformation.caries.boilingMottledTooth || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>错颌</p>
                <p>{{ healthInformation.caries.malocclusion || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>牙釉质发育不全</p>
                <p>{{ healthInformation.caries.enamelHypoplasia || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>义齿</p>
                <p>{{ healthInformation.caries.denture || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>浅牙周袋</p>
                <p>{{ healthInformation.caries?.superficialPeriodontalPocket || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>其他牙病</p>
                <p>{{ healthInformation.caries.otherDiseases || '/' }}</p>
              </n-gi>
            </n-grid>
            <n-grid v-else-if="subItem.screeningItemCode == 'hengya'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>恒牙</p>
                <p>{{ healthInformation.caries.totalPermanentNum || 0 }} 颗</p>
              </n-gi>
            </n-grid>
            <n-grid v-else-if="subItem.screeningItemCode == 'quchi'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>无龋</p>
                <p>{{ healthInformation.caries.filledWithoutCaries }}</p>
              </n-gi>
              <n-gi>
                <p>冠龋</p>
                <p>{{ healthInformation.caries.coronalCaries }}</p>
              </n-gi>
              <n-gi>
                <p>已填充有龋</p>
                <p>{{ healthInformation.caries.filledCaries }}</p>
              </n-gi>
              <n-gi>
                <p>已充填无龋</p>
                <p>{{ healthInformation.caries.filledWithoutCaries }}</p>
              </n-gi>
              <n-gi>
                <p>因龋缺失</p>
                <p>{{ healthInformation.caries.missingByCaries }}</p>
              </n-gi>
              <n-gi>
                <p>缺牙</p>
                <p>{{ healthInformation.caries.missing }}</p>
              </n-gi>
              <n-gi>
                <p>其他</p>
                <p>{{ healthInformation.caries.other }}</p>
              </n-gi>
            </n-grid>
            <div v-else>
              <p>{{ subItem.screeningItemCode }}</p>
              <p>{{ subItem.number }}</p>
            </div>
          </n-gi>
        </n-grid>
      </section>
    </template>
    <template v-if="state.screeningOptions3.length && healthInformation.checkup">
      <section v-for="(item, index) in state.screeningOptions3" :key="index" px-5>
        <p class="text-15px font-bold my-3">{{ item.screeningTypeName }}</p>
        <n-grid :cols="3" x-gap="12" y-gap="12">
          <n-gi
            v-for="(subItem, idx) in item.itemList"
            :key="idx"
            :span="
              subItem.screeningItemCode == 'tz_stxt' ||
              subItem.screeningItemCode == 'tz_xuechanggui' ||
              subItem.screeningItemCode == 'tz_quchi' ||
              subItem.screeningItemCode == 'tz_yazhou' ||
              subItem.screeningItemCode == 'tz_hyzs' ||
              subItem.screeningItemCode == 'tz_quguang' ||
              subItem.screeningItemCode == 'tz_shili' ||
              subItem.screeningItemCode == 'tz_shayan' ||
              subItem.screeningItemCode == 'tz_chuanjing' ||
              subItem.screeningItemCode == 'tz_tingli' ||
              subItem.screeningItemCode == 'tz_wedygm' ||
              subItem.screeningItemCode == 'tz_jiemoyan' ||
              subItem.screeningItemCode == 'tz_jzwqybjc' ||
              subItem.screeningItemCode == 'tz_jzqhwqybjc' ||
              subItem.screeningItemCode == 'tz_jzjbs'
                ? 3
                : 1
            "
          >
            <div v-if="subItem.screeningItemCode == 'tz_kajiemiao'">
              <p>卡介苗</p>
              <p>{{ healthInformation.checkup.bcgVaccine || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_yxgyym'">
              <p>乙型肝炎疫苗</p>
              <p>{{ healthInformation.checkup.hepatitisBVaccine || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_gshzyyz'">
              <p>脊髓灰质炎疫症</p>
              <p>{{ healthInformation.checkup.poliomyelitis || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_bbpym'">
              <p>百白破疫苗</p>
              <p>{{ healthInformation.checkup.tdapVaccine || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_msfym'">
              <p>麻腮风疫苗</p>
              <p>{{ healthInformation.checkup.mmrVaccine || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_lnym'">
              <p>流脑疫苗</p>
              <p>{{ healthInformation.checkup.meningitisVaccine || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_jgym'">
              <p>甲肝疫苗</p>
              <p>{{ healthInformation.checkup.hepatitisAVaccine || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_ynym'">
              <p>乙脑疫苗</p>
              <p>{{ healthInformation.checkup.jeVaccine || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_jwbs'">
              <p>既往病史</p>
              <p>{{ healthInformation.checkup.pastMedicalHistory || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_qcqfy'">
              <p>青春期发育</p>
              <p>
                <span v-if="formValue.sex">{{ formValue.sex == 1 ? '男生遗精年龄' : '女生初潮年龄' }}</span>
                {{ healthInformation.checkup.ageOfSpermatogenesis || healthInformation.checkup.ageOfMenarche || '/' }}岁
              </p>
            </div>
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_stxt'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>身高</p>
                <p>{{ healthInformation.checkup.height || '/' }} cm</p>
              </n-gi>
              <n-gi>
                <p>体重</p>
                <p>{{ healthInformation.checkup.weight || '/' }} kg</p>
              </n-gi>
              <n-gi>
                <p>胸围</p>
                <p>{{ healthInformation.checkup.bust || '/' }} cm</p>
              </n-gi>
              <n-gi>
                <p>腰围</p>
                <p>{{ healthInformation.checkup.waistline || '/' }} cm</p>
              </n-gi>
              <n-gi>
                <p>臀围</p>
                <p>{{ healthInformation.checkup.hipline || '/' }} cm</p>
              </n-gi>
              <n-gi>
                <p>体重指数</p>
                <p>{{ healthInformation.checkup.bmi || '/' }}</p>
              </n-gi>
            </n-grid>

            <div v-else-if="subItem.screeningItemCode == 'tz_fjhmqjcsjkyzzwz'">
              <p>肺结核密切接触史及可疑症状问诊</p>
              <p>{{ healthInformation.checkup.tuberculosisInquiry || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_xin'">
              <p>心</p>
              <p>{{ healthInformation.checkup.heart || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_fei'">
              <p>肺</p>
              <p>{{ healthInformation.checkup.lung || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_gan'">
              <p>肝</p>
              <p>{{ healthInformation.checkup.liver || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_pi'">
              <p>脾</p>
              <p>{{ healthInformation.checkup.spleen || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_toubu'">
              <p>头部</p>
              <p>{{ healthInformation.checkup.spleen || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_jingbu'">
              <p>颈部</p>
              <p>{{ healthInformation.checkup.neck || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_zuoshangzhi'">
              <p>左上肢</p>
              <p>{{ healthInformation.checkup.leftUpperLimb || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_youshangzhi'">
              <p>右上肢</p>
              <p>{{ healthInformation.checkup.rightUpperLimb || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_sizhi'">
              <p>四肢</p>
              <p>{{ healthInformation.checkup.limbs || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_xiongbu'">
              <p>胸部</p>
              <p>{{ healthInformation.checkup.chest || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_pifu'">
              <p>皮肤</p>
              <p>{{ healthInformation.checkup.skin || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_linbajie'">
              <p>淋巴结</p>
              <p>{{ healthInformation.checkup.ln || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_nxwszq'">
              <p>男性外生殖器</p>
              <p>{{ healthInformation.checkup.meg || '/' }}</p>
            </div>

            <div v-else-if="subItem.screeningItemCode == 'tz_jzwqybjc'">
              <p font-bold>脊柱侧弯</p>
              <n-grid :cols="3" x-gap="0" y-gap="12" mb-3>
                <n-gi>
                  <p>一般检查</p>
                  <p>{{ healthInformation.checkup.bendGeneralInspection || '/' }}</p>
                </n-gi>
                <n-gi>
                  <p>前屈-胸段</p>
                  <p>{{ healthInformation.checkup.anteriorFlexionThoracic || '/' }}</p>
                </n-gi>
                <n-gi>
                  <p>前屈-腰胸段</p>
                  <p>{{ healthInformation.checkup.anteriorFlexionWaistChest || '/' }}</p>
                </n-gi>
                <n-gi>
                  <p>前屈-腰段</p>
                  <p>{{ healthInformation.checkup.anteriorLumbarFlexion || '/' }}</p>
                </n-gi>
              </n-grid>

              <template v-if="healthInformation.checkup.spinalMovementTest == 1">
                <p font-bold>躯干旋转测量仪检查</p>
                <n-grid :cols="3" x-gap="0" y-gap="12" mb-3>
                  <n-gi>
                    <p>胸段ATR</p>
                    <p>{{ healthInformation.checkup.thoracicSegmentAtr || '/' }}</p>
                  </n-gi>
                  <n-gi>
                    <p>腰胸段ATR</p>
                    <p>{{ healthInformation.checkup.thoracolumbarSegmentAtr || '/' }}</p>
                  </n-gi>
                  <n-gi>
                    <p>腰段ATR</p>
                    <p>{{ healthInformation.checkup.lumbarSegmentAtr || '/' }}</p>
                  </n-gi>
                </n-grid>
              </template>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_jzqhwqybjc'">
              <p font-bold>脊柱前后弯曲</p>
              <n-grid :cols="3" x-gap="0" y-gap="12" mb-3>
                <n-gi>
                  <p>一般检查</p>
                  <p>{{ healthInformation.checkup.bfBendGeneralInspection || '/' }}</p>
                </n-gi>
                <n-gi>
                  <p>俯卧实验</p>
                  <p>{{ healthInformation.checkup.proneTest || '/' }}</p>
                </n-gi>
              </n-grid>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_jzjbs'">
              <p font-bold>脊柱疾病史</p>
              <n-grid :cols="3" x-gap="0" y-gap="12" mb-3>
                <n-gi>
                  <p>疾病史</p>
                  <p>{{ healthInformation.checkup.historyDisease || '/' }}</p>
                </n-gi>
              </n-grid>
            </div>

            <!-- 老的脊柱侧弯---start---- -->
            <div v-else-if="subItem.screeningItemCode == 'tz_xdcw'">
              <p>胸段侧弯</p>
              <p>{{ healthInformation.checkup.chestBending || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_yxdcw'">
              <p>腰胸段侧弯</p>
              <p>{{ healthInformation.checkup.waistChestBending || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_ydcw'">
              <p>腰段侧弯</p>
              <p>{{ healthInformation.checkup.waistBending || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_qhwq'">
              <p>前后弯曲</p>
              <p>{{ healthInformation.checkup.aroundBending || '/' }}</p>
            </div>
            <!-- 老的脊柱侧弯end -->

            <div v-else-if="subItem.screeningItemCode == 'tz_bi'">
              <p>鼻</p>
              <p>{{ healthInformation.checkup.nose || '/' }}</p>
            </div>

            <div v-else-if="subItem.screeningItemCode == 'tz_yjsfybb'">
              <p>眼睛是否有病变</p>
              <p>{{ healthInformation.checkup.bcgVaccine || '/' }}</p>
            </div>
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_xuechanggui'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>红细胞计数</p>
                <p>{{ healthInformation.checkup.redBloodCellCount || '/' }} * 10<sup>12</sup> /L</p>
              </n-gi>
              <n-gi>
                <p>白细胞计数</p>
                <p>{{ healthInformation.checkup.whiteBloodCellCount || '/' }} * 10<sup>9</sup> /L</p>
              </n-gi>
              <n-gi>
                <p>血小板计数</p>
                <p>{{ healthInformation.checkup.bloodPlateletCount || '/' }} * 10<sup>9</sup> /L</p>
              </n-gi>
            </n-grid>
            <div v-else-if="subItem.screeningItemCode == 'tz_xuexing'">
              <p>血型</p>
              <p>{{ healthInformation.checkup.bt || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_xhdb'">
              <p>血红蛋白</p>
              <p>{{ healthInformation.checkup.hb || '/' }} g/L</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_sfpx'">
              <p>是否贫血</p>
              <p>{{ healthInformation.checkup.isAnemia || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_ruchongluan'">
              <p>蠕虫卵</p>
              <p>{{ healthInformation.checkup.helminthEggs || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_gangongneng'">
              <p>肝功能</p>
              <p>{{ healthInformation.checkup.bcgVaccine || '/' }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tz_jhjssy'">
              <p>结核菌素试验</p>
              <p>{{ healthInformation.checkup.tuberculinTest || '/' }}</p>
            </div>
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_wedygm'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>外耳道与估摸（右耳）</p>
                <p>{{ healthInformation.checkup.rightEarGuess || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>外耳道与估摸（左耳）</p>
                <p>{{ healthInformation.checkup.leftEarGuess || '/' }}</p>
              </n-gi>
            </n-grid>
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_tingli'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>听力（右耳）</p>
                <p>{{ healthInformation.checkup.leftEarHearing || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>听力（左耳）</p>
                <p>{{ healthInformation.checkup.rightEarHearing || '/' }}</p>
              </n-gi>
            </n-grid>
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_chuanjing'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>窜镜（右眼）</p>
                <p>{{ healthInformation.checkup.rigthtStringOfMirror || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>窜镜（左眼）</p>
                <p>{{ healthInformation.checkup.leftStringOfMirror || '/' }}</p>
              </n-gi>
            </n-grid>
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_shayan'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>沙眼（右眼）</p>
                <p>{{ healthInformation.checkup.rightTrachoma || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>沙眼（左眼）</p>
                <p>{{ healthInformation.checkup.leftTrachoma || '/' }}</p>
              </n-gi>
            </n-grid>
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_jiemoyan'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>结膜炎（左眼）</p>
                <p>{{ healthInformation.checkup.bcgVaccine || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>结膜炎（右眼）</p>
                <p>{{ healthInformation.checkup.bcgVaccine || '/' }}</p>
              </n-gi>
            </n-grid>
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_sejue'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>色觉（左眼）</p>
                <p>{{ healthInformation.checkup.bcgVaccine || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>色觉（右眼）</p>
                <p>{{ healthInformation.checkup.bcgVaccine || '/' }}</p>
              </n-gi>
            </n-grid>

            <n-grid v-else-if="subItem.screeningItemCode == 'tz_yazhou'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>未见明显异常</p>
                <p>{{ healthInformation.checkup.healthyGums || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>牙龈炎</p>
                <p>{{ healthInformation.checkup.gingivitis || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>牙石</p>
                <p>{{ healthInformation.checkup.tartar || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>深牙周袋</p>
                <p>{{ healthInformation.checkup.tartar || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>牙周炎</p>
                <p>{{ healthInformation.checkup?.superficialPeriodontalPocket || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>沸斑牙</p>
                <p>{{ healthInformation.checkup.boilingMottledTooth || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>错颌</p>
                <p>{{ healthInformation.checkup.malocclusion || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>牙釉质发育不全</p>
                <p>{{ healthInformation.checkup.enamelHypoplasia || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>义齿</p>
                <p>{{ healthInformation.checkup.denture || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>浅牙周袋</p>
                <p>{{ healthInformation.checkup?.superficialPeriodontalPocket || '/' }}</p>
              </n-gi>
              <n-gi>
                <p>其他牙病</p>
                <p>{{ healthInformation.checkup.otherDiseases || '/' }}</p>
              </n-gi>
            </n-grid>
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_hyzs'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>恒牙</p>
                <p>{{ healthInformation.checkup.totalPermanentNum || 0 }} 颗</p>
              </n-gi>
            </n-grid>
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_quchi'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>无龋</p>
                <p>{{ healthInformation.checkup.filledWithoutCaries }}</p>
              </n-gi>
              <n-gi>
                <p>冠龋</p>
                <p>{{ healthInformation.checkup.coronalCaries }}</p>
              </n-gi>
              <n-gi>
                <p>已填充有龋</p>
                <p>{{ healthInformation.checkup.filledCaries }}</p>
              </n-gi>
              <n-gi>
                <p>已充填无龋</p>
                <p>{{ healthInformation.checkup.filledWithoutCaries }}</p>
              </n-gi>
              <n-gi>
                <p>因龋缺失</p>
                <p>{{ healthInformation.checkup.missingByCaries }}</p>
              </n-gi>
              <n-gi>
                <p>缺牙</p>
                <p>{{ healthInformation.checkup.missing }}</p>
              </n-gi>
              <n-gi>
                <p>其他</p>
                <p>{{ healthInformation.checkup.other }}</p>
              </n-gi>
            </n-grid>
            <!--视力筛查项目-->
            <n-grid v-else-if="subItem.screeningItemCode == 'tz_shili'" :cols="3" x-gap="0" y-gap="12" mb-3>
              <n-gi>
                <p>戴镜类型</p>
                <p>{{ GlassesTypes[healthInformation.checkup.isGlasses || 0] }}</p>
              </n-gi>
              <n-gi>
                <p>裸眼视力</p>
                <p>
                  左眼：{{ healthInformation.checkup.osVision }}
                  <br />
                  右眼：{{ healthInformation.checkup.odVision }}
                </p>
              </n-gi>
              <n-gi>
                <p>戴镜视力</p>
                <p>
                  左眼：{{ healthInformation.checkup.osEyesight }}
                  <br />
                  右眼：{{ healthInformation.checkup.odEyesight }}
                </p>
              </n-gi>
              <n-gi>
                <p>戴镜度数</p>
                <p>
                  左眼：{{ healthInformation.checkup.osGlasses }}
                  <br />
                  右眼：{{ healthInformation.checkup.odGlasses }}
                </p>
              </n-gi>
            </n-grid>
            <!--屈光筛查项目-->
            <template v-else-if="subItem.screeningItemCode == 'tz_quguang'">
              <n-grid :cols="3" x-gap="0" y-gap="12" mb-3>
                <n-gi>
                  <p>球镜度数</p>
                  <p>
                    左眼：{{ healthInformation.checkup.dpOsSph }}
                    <br />
                    右眼：{{ healthInformation.checkup.dpOdSph }}
                  </p>
                </n-gi>
                <n-gi>
                  <p>柱镜度数</p>
                  <p>
                    左眼：{{ healthInformation.checkup.dpOsCyl }}
                    <br />
                    右眼：{{ healthInformation.checkup.dpOdCyl }}
                  </p>
                </n-gi>
                <n-gi>
                  <p>轴位</p>
                  <p>
                    左眼：{{ healthInformation.checkup.dpOsAxial }}
                    <br />
                    右眼：{{ healthInformation.checkup.dpOdAxial }}
                  </p>
                </n-gi>
              </n-grid>
              <n-grid :cols="3" x-gap="0" y-gap="12" mb-3>
                <n-gi>
                  <p>R1</p>
                  <p>
                    左眼：{{ healthInformation.checkup.orbLeftR1Mm }}mm {{ healthInformation.checkup.orbLeftR1D }}D
                    <br />
                    右眼：{{ healthInformation.checkup.orbRightR1Mm }}mm {{ healthInformation.checkup.orbRightR1D }}D
                  </p>
                </n-gi>
                <n-gi>
                  <p>R2</p>
                  <p>
                    左眼：{{ healthInformation.checkup.orbLeftR2Mm }}mm
                    {{ healthInformation.checkup.orbLeftR2D }}D<br />
                    右眼：{{ healthInformation.checkup.orbRightR2Mm }}mm {{ healthInformation.checkup.orbRightR2D }}D
                  </p>
                </n-gi>
                <n-gi>
                  <p>AX</p>
                  <p>
                    左眼：{{ healthInformation.checkup.orbLeftAx }}
                    <br />
                    右眼：{{ healthInformation.checkup.orbRightAx }}
                  </p>
                </n-gi>
              </n-grid>
            </template>
            <!--其他类型筛查项目-->
            <div v-else>
              <p>{{ subItem.screeningItemCode }}</p>
              <p>{{ subItem.number || '/' }}</p>
            </div>
          </n-gi>
        </n-grid>
      </section>
    </template>
    <template v-if="state.screeningOptions4.length && healthInformation.physical">
      <section v-for="(item, index) in state.screeningOptions4" :key="index" px-5>
        <p class="text-15px font-bold my-3">{{ item.screeningTypeName }}</p>
        <n-grid :cols="3" x-gap="12" y-gap="12">
          <n-gi v-for="(subItem, idx) in item.itemList" :key="idx">
            <div v-if="subItem.screeningItemCode == 'tc_fhl'">
              <p>肺活量</p>
              <p>{{ healthInformation.physical.vc || '/' }}ml</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tc_1000mp'">
              <p>1000米跑</p>
              <p>{{ transferTime(healthInformation.physical.thousand) }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tc_50mwfp'">
              <p>50米*8往返跑</p>
              <p>{{ transferTime(healthInformation.physical.fiftyEight) }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tc_ytxs'">
              <p>引体向上</p>
              <p>{{ healthInformation.physical.pullUp || '/' }}个</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tc_zwtqq'">
              <p>坐位体前屈</p>
              <p>{{ healthInformation.physical.stf || '/' }}cm</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tc_50mp'">
              <p>50米跑</p>
              <p>{{ healthInformation.physical.fifty || '/' }}秒</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tc_ldty'">
              <p>立定跳远</p>
              <p>{{ healthInformation.physical.jump || '/' }}cm</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tc_1mints'">
              <p>一分钟跳绳</p>
              <p>{{ healthInformation.physical.skipping || '/' }}个</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tc_800mp'">
              <p>800米跑</p>
              <p>{{ transferTime(healthInformation.physical.eightHundred) }}</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tc_1minywqz'">
              <p>一分钟仰卧起坐</p>
              <p>{{ healthInformation.physical.abdominal || '/' }}个</p>
            </div>
            <div v-else-if="subItem.screeningItemCode == 'tc_tzzs'">
              <p>体重指数</p>
              <p>{{ healthInformation.physical.bmi || '/' }}kg/㎡</p>
            </div>

            <!--其他类型筛查项目-->
            <div v-else>
              <p>{{ subItem.screeningItemCode }}</p>
              <p>{{ subItem.number || '/' }}</p>
            </div>
          </n-gi>
        </n-grid>
      </section>
    </template>
    <!-- 正脊 -->
    <template v-if="healthInformation.spine">
      <div class="px-5">
        <h2 class="font-bold mr-4 text-4 mb-2">脊柱侧弯</h2>
        <n-descriptions label-placement="left" :column="3" label-style="font-weight: bold">
          <n-descriptions-item label="一般检查">
            <span :class="{ '!text-red': errorT(healthInformation.spine.bendGeneralInspection) }">
              {{ healthInformation.spine.bendGeneralInspection || '/' }}
            </span>
          </n-descriptions-item>
          <n-descriptions-item
            label="前屈-胸段"
            :class="{ '!text-red': errorT(healthInformation.spine.anteriorFlexionThoracic) }"
          >
            <span :class="{ '!text-red': errorT(healthInformation.spine.anteriorFlexionThoracic) }">
              {{ healthInformation.spine.anteriorFlexionThoracic || '/' }}
            </span>
          </n-descriptions-item>
          <n-descriptions-item label="前屈-腰胸段">
            <span :class="{ '!text-red': errorT(healthInformation.spine.anteriorFlexionWaistChest) }">
              {{ healthInformation.spine.anteriorFlexionWaistChest || '/' }}
            </span>
          </n-descriptions-item>
          <n-descriptions-item label="试验-腰段">
            <span :class="{ '!text-red': errorT(healthInformation.spine.anteriorLumbarFlexion) }">
              {{ healthInformation.spine.anteriorLumbarFlexion || '/' }}
            </span>
          </n-descriptions-item>
          <n-descriptions-item label="脊柱运动试验" :span="2">
            <span>
              {{ healthInformation.spine.spinalMovementTest || '/' }}
            </span>
          </n-descriptions-item>
          <n-descriptions-item label="躯干旋转测量仪检查" :span="3">
            <span>
              胸段ATR：
              <span :class="{ '!text-red': errorT(healthInformation.spine.thoracicSegmentAtr) }">
                {{ healthInformation.spine.thoracicSegmentAtr || '/' }}
              </span>
              ，
            </span>
            <span>
              腰胸段ATR：
              <span :class="{ '!text-red': errorT(healthInformation.spine.thoracolumbarSegmentAtr) }">
                {{ healthInformation.spine.thoracolumbarSegmentAtr || '/' }}
              </span>
              ，
            </span>
            <span>
              腰段ATR：
              <span :class="{ '!text-red': errorT(healthInformation.spine.lumbarSegmentAtr) }">
                {{ healthInformation.spine.lumbarSegmentAtr || '/' }}
              </span>
            </span>
          </n-descriptions-item>
        </n-descriptions>
      </div>
      <div class="px-5 mt-8">
        <h2 class="font-bold mr-4 text-4 mb-2">脊柱前后弯曲异常</h2>
        <n-descriptions label-placement="left" :column="2" label-style="font-weight: bold">
          <n-descriptions-item label="一般检查">
            <span :class="{ '!text-red': errorT(healthInformation.spine.bfBendGeneralInspection) }">
              {{ healthInformation.spine.bfBendGeneralInspection || '/' }}
            </span>
          </n-descriptions-item>
          <n-descriptions-item label="俯卧试验">
            <span :class="{ '!text-red': errorT(healthInformation.spine.proneTest) }">
              {{ healthInformation.spine.proneTest || '/' }}
            </span>
          </n-descriptions-item>
          <n-descriptions-item label="疾病史">
            <span :class="{ '!text-red': errorT(healthInformation.spine.historyDisease) }">
              {{ healthInformation.spine.historyDisease || '/' }}
            </span>
          </n-descriptions-item>
        </n-descriptions>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { object, array } from 'vue-types';
const props = defineProps({
  healthInfoList: array().def([]),
  formValue: object().def({}),
  state: object().def({
    screeningOptions1: [], // 视力筛查项 与 自定义筛查项赋值
    screeningOptions2: [], // 龋齿筛查项 与 自定义筛查项赋值
    screeningOptions3: [], // 体检筛查项 与 自定义筛查项赋值
    screeningOptions4: [] // 体测筛查项 与 自定义筛查项赋值
  })
});
const GlassesTypes = {
  0: '无',
  1: '框架眼镜',
  2: '隐形眼镜',
  3: 'OK镜'
};

const reportTitle = computed(() => {
  let titleEnum = {
    1: '视力筛查',
    2: '龋齿筛查',
    3: '学生体检',
    4: '学生体测',
    5: '脊柱筛查'
  };
  return titleEnum[props.state.appType];
});

const transferTime = val => {
  let str = val ? (val > 60 ? `${Math.floor(val / 60)}分${val % 60}秒` : `${val}秒`) : '/';
  return str;
};

function errorT(v) {
  if (!v) return;
  return !['无', '无侧弯', '正常'].includes(v);
}
</script>

<style lang="less" scoped></style>

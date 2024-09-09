import { defineStore } from 'pinia';

export const useReportStore = defineStore('report-store', {
  state: () => ({
    planId: '',
    areaId: '',
    areaLevel: '',
    areaName: '',
    schoolId: '',
    schoolType: '',
    gradeId: '',
    classId: ''
  }),
  getters: {
    getAreaData() {
      return {
        planId: this.planId,
        areaId: this.areaId,
        areaLevel: this.areaLevel,
        areaName: this.areaName,
        schoolId: this.schoolId,
        gradeId: this.gradeId,
        classId: this.classId,
        schoolType: this.schoolType
      };
    }
  },
  actions: {
    setAreaData({ planId, areaId, areaLevel, areaName, schoolId, gradeId, classId, schoolType }) {
      this.planId = planId;
      this.areaId = areaId;
      this.areaLevel = areaLevel;
      this.areaName = areaName;
      this.schoolId = schoolId;
      this.gradeId = gradeId;
      this.classId = classId;
      this.schoolType = schoolType;
    }
  }
});

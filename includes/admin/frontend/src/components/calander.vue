<template>
  <div class="date-picker" ref="datePicker">
    <input type="text"
           :class="focus==='date'? 'date': ''"
           @blur="focus=''"
           class="cdn resize-none text-xs z-50 appearance-none border gray-border rounded-l-lg w-full py-2 px-3 h-[2.5rem] text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent" v-model="selectedDate" @focus="showCalendar" />
    <div class="calendar" v-if="show">
      <div class="calendar-header">
        <button @click="previousMonth">&lt;</button>
        <span>{{ monthName }} {{ year }}</span>
        <button @click="nextMonth">&gt;</button>
      </div>
      <table>
        <thead>
        <tr>
          <th v-for="day in daysOfWeek" :key="day">{{ day }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="week in weeks" :key="week">
          <td v-for="day in week" :key="day" :class="{ today: isToday(day), selected: isSelected(day) }" @click="selectDate(day)">
            {{ day }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      focus: '',
      selectedDate: null,
      show: false,
      year: null,
      month: null,
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      dateOptions: { day: 'numeric', month: 'numeric', year: 'numeric' }
    };
  },
  computed: {
    weeks() {
      const weeks = [];
      let week = [];
      const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(this.year, this.month, i).getDay();

        if (i === 1) {
          for (let j = 0; j < day; j++) {
            week.push(null);
          }
        }

        week.push(i);

        if (day === 6 || i === daysInMonth) {
          weeks.push(week);
          week = [];
        }
      }

      return weeks;
    },
    monthName() {
      const options = { month: 'long' };
      return new Intl.DateTimeFormat('en-US', options).format(new Date(this.year, this.month));
    },
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    showCalendar() {
      this.show = true;
      this.focus = 'date';
      if (!this.year || !this.month) {
        const now = new Date();
        this.year = now.getFullYear();
        this.month = now.getMonth();
      }
    },
    hideCalendar() {
      this.show = false;
    },
    nextMonth() {
      if (this.month === 11) {
        this.month = 0;
        this.year++;
      } else {
        this.month++;
      }
    },
    previousMonth() {
      if (this.month === 0) {
        this.month = 11;
        this.year--;
      } else {
        this.month--;
      }
    },
    selectDate(day) {
      const selectedDate = new Date(this.year, this.month, day);
      this.selectedDate = selectedDate.toLocaleDateString('en-US', this.dateOptions);
      this.hideCalendar();
      this.$emit('update:selectedDate', this.selectedDate);
    },

    isToday(day) {
      const today = new Date();
      return this.year === today.getFullYear() && this.month === today.getMonth() && day === today.getDate();
    },
    isSelected(day) {
      if (this.selectedDate === null) {
        return false;
      }

      const selected = new Date(this.selectedDate);
      const dateToCheck = new Date(this.year, this.month, day);
      return dateToCheck.toDateString() === selected.toDateString();

    },
    handleClickOutside(event) {
      if (!this.$refs.datePicker.contains(event.target)) {
        this.hideCalendar();
      }
    },
  },
};
</script>


<style scoped>
.date-picker {
  position: relative;
  display: inline-block;
}

.calendar {
  position: absolute;
  top:45px;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 1;
  border-radius: 15px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.calendar-header button {
  font-size: 16px;
  padding: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.calendar table {
  width: 100%;
  border-collapse: collapse;
}

.calendar th {
  text-align: center;
  padding: 5px;
  font-weight: normal;
}

.calendar td {
  text-align: center;
  padding: 5px;
  cursor: pointer;
}

.calendar td:hover {
  background-color: #eee;
  border-radius: 5px;
}

.calendar td.today {
  background-color: #eee;
  border-radius: 5px;
}

.calendar td.selected {
  background-color: #7F54B3;
  color: white;
  border-radius: 5px;
}
</style>



let unitInfo = new Vue({

  el: '#unitInfo',
  data: {
    unitName: '',
    hp: '',
    attack: '',
    attackBonus: [''],
    armor: '',
    cost: {},
    display: false,
  },
  created() {
    this.aoeUnit();
    //axios.post('/api/armies', "potato");
  },

  methods: {
    async aoeUnit() {
      try {
        const response = await axios.get('https://cors-anywhere.herokuapp.com/' + 'https://age-of-empires-2-api.herokuapp.com/api/v1/unit/' + this.unitName);
        this.hp = response.data.hit_points;
        this.attack = response.data.attack;
        this.attackBonus = response.data.attack_bonus;
        this.armor = response.data.armor;
        this.cost = response.data.cost;
        this.display = true;
      } catch (error) {
        console.log(error);
      }
    },

    createUnit(){
      this.display = true;
      this.aoeUnit();
    },

    createArmy(){
      this.displayArmy = true;
    },
  },

  computed: {
    relatedArr : function (){
      let related = new Array;
      if (this.cost.Wood > 0){
        var temp = {name: 'Wood', price: this.cost.Wood}
        related.push(temp);
      }
      if (this.cost.Food > 0){
        var temp = {name: 'Food', price: this.cost.Food}
        related.push(temp);
      }
      if (this.cost.Gold > 0){
        var temp = {name: 'Gold', price: this.cost.Gold}
        related.push(temp);
      }
      if (this.cost.Stone > 0){
        var temp = {name: 'Stone', price: this.cost.Stone}
        related.push(temp);
      }
      return related;
    },
    bonusArr : function (){
      let bonus = new Array;
      if (this.attackBonus == undefined){return bonus;}
      else {
        bonus.push("Attack Bonus");
        for (let i = 0; i < this.attackBonus.length; i++){
          bonus.push(this.attackBonus[i]);
        }
        return bonus;
      }
    },
  },
});

let unitList = new Vue({
  el: '#unitList',
  data: {
    listUnits: [''],
    ready: false,
  },

  created() {
    this.aoeList();
  },

  methods: {
    async aoeList() {
      try {
        const response = await axios.get('https://cors-anywhere.herokuapp.com/' + 'https://age-of-empires-2-api.herokuapp.com/api/v1/units');
        for(let i = 0; i < response.data.units.length; i++){
          this.listUnits[i] = response.data.units[i].name;
        }
        this.ready = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
});


let army = new Vue({
  el: '#army',
  data:{
    displayArmy: false,
    displayArmyList: false,
    currUnit: '',
    currQuant: '',
    armyTitle: '',
    armyArr: [],
    allArmy: [],
    findTitle: "",
    findArmy: null,
    edit: false,
    del: false,
  },
  created() {
    this.getArmies();
  },
  methods: {
    dispArmy(){
      this.armyTitle = '';
      this.findArmy = null;
      this.displayArmyList = false;
      this.displayArmy = true;
      this.del = false;
      this.edit = false;
    },
    dispArmyList(){
      this.armyTitle = '';
      this.findArmy = null;
      this.displayArmy = false;
      this.displayArmyList = true;
      this.del = false;
      this.edit = false;
    },
    displayArmy(){
      return this.displayArmy;
    },
    displayArmyList(){
      return this.displayArmyList;
    },
    addToArmy() {
      let newUnit = {
        unitName: this.currUnit,
        quantity: this.currQuant,
      };
      this.armyArr.push(newUnit);
      this.currUnit = '';
      this.currQuant = '';
      this.displayArmy = true;
    },
    selectArmy(army){
      this.findTitle = "";
      this.findArmy = army;
      this.armyTitle = this.findArmy.title;
      this.displayArmyList = false;
      this.del = false;
      this.edit = false;
    },
    editArmy(){
      this.edit = true;
      this.del = false;
    },
    delArmy(){
      this.del = true;
      this.edit = false;
    },
    deleteUnit(unit){
      var index = this.findArmy.units.indexOf(unit);
      if(index > -1){
        this.findArmy.units.splice(index, 1);
      }
    },
    doneWithCurrArmy(){

      this.armyTitle = '';
      this.findArmy = null;
      this.displayArmyList = true;
    },
    async postArmy(){
      try {
        this.displayArmy = false;
        await axios.post('/api/armies', {
          title: this.armyTitle,
          units: this.armyArr,
        });
        this.armyArr = [];
        this.armyTitle = '';
        this.currUnit = '';
        this.currQuant = '';
        await this.getArmies();
      } catch (error) {
        console.log(error);
      }
    },
    async getArmies(){
      try {
        let response =  await axios.get('/api/armies');
        this.allArmy = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async putArmy(army){
      try {
        let response = await axios.put('/api/armies/' + army._id,{
          title: this.findArmy.title,
          units: this.findArmy.units,
        });
        this.findArmy = null;
        this.getArmies();
        return true;
      } catch(error){
        console.log(error);
      }
    },
    async deleteArmy(army){
      try {
        let response = await axios.delete('/api/armies/' + army._id);
        this.findArmy = null;
        this.getArmies();
        return true;
      } catch(error) {
        console.log(error);
      }
    },
  },
  computed: {
    suggestions() {
      return this.allArmy.filter(army => army.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    }
  },
});

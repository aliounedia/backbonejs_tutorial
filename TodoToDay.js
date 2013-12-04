
//Datas to Work with
var datas =[
  {do :'Tester mon application' , time: '7h', done:'false'},
  {do :'Alleter bebe' , time: '8h', done:false},
  {do :'Aller travailler', time: '8h 30', done:'false'},
  {do :'Prendre une pose cafe', time: '8h 50', done:'false'}
]


//Mon Model , ToDoToDay
ToDoToDay  = Backbone.Model.extend({
  initialize: function(options){
  //set default value 
  this.do  = options.do ||   'Nothing to to'  

  //set default time
  this.time= options.time 
  this.done= options.done
    
  }  
})

//Collection 
TodoDodayCollection = Backbone.Collection.extend({
   model : ToDoToDay ,
   todoSize: function(){
     return this.length || 0 
  },
  fetch: function(){
      self =this
    _.each(datas, function(data){
      self.add(new ToDoToDay(data))
     })
  }
  
})

//Model View
TodoDodayView = Backbone.View.extend({
  //You should specify The tagName here , for me I need to create a Table
  //So my tag name is tr , backbone will wrap the content with this
  //tag Name

  //Here we don't need to specify a el , because this is an inner
  //view


  tagName:"tr",

  //My Inner Temple , This is the  template for each element , so
  // collection render view will iterate over each view

  template : '<td>{{do}}</td><td>{{time}}</td><td>{{done}}</td>\
  <td><input type ="submit" value ="EditModel"   id= "EditModel"/>\
  <input type ="submit"     value ="DeleteModel" id= "DeleteModel"/></td>\
  ',

  //Events  generated by a ToDoToDay Item view element
  events:{
    "click #EditModel"  :"editModel","click #DeleteModel":"deleteModel",
  },

  //Initialize your view element

  initialize: function(){
    //Bind model_change to View
    this.model.bind("all", this.render, this)
    this.render()
  },
  //Render view , see backcbone so be sur that you should return
  //this for best practic

  render: function(){
    this.$el.html(Mustache.render(this.template,this.model))
   
  },

  //destroy me 
  deleteModel: function(event){
    event.preventDefault()
    this.model.destroy()

  },

  //Edit item , when someone click on buton this fonction will
  // fill text input with the current item todo time and description

  editModel: function(event){
    event.preventDefault()
    $("#do").val(this.model.do)
    $("#time").val(this.model.time)
    // attach model to change to the parent collection
    //This is a hack , check backbone  for fix 
    this.model.collection.toUpdate =this.model
  }
  })

  //Collection of item view

  TodoDodayCollectionView = Backbone.View.extend({
  events:{
    "click #delAll":"delAllModel",
    "click #addOne":"addOneModel",
    "click #updateOne":"updateOne"

  },

  //Initialise our collection view
  initialize: function(){
    //Bind model
    this.model.fetch()
    this.model.bind("all", this.render, this)
    this.render()
  }
  ,

  //Mehod To render collection, before rendering elements ,we need
  //to empty content of div, to delete the previous render element

  render:function(){
   var self = this
   self.$el.find("#table").empty()
   this.model.each(function(_model){
       self.$el.find("#table").append(new TodoDodayView(
           {model:_model}).$el
      )
   })
   return self
  },

  // This method allow you to add each element to the collection
  addOneModel: function(event){
    event.preventDefault()
    this.model.add({do: this.$el.find("#do").val(), time: this.$el.find("#time").val()}) 
  },

  //destroy collection
  delAllModel:function(event){
    event.preventDefault()
    this.model.reset()
  },

  //Update One element of the collection

  updateOne: function(event){
    event.preventDefault()
    // remove the olld model attached to this collection
    // when used clicked to the Update to do item
    // Line 95 in editModel
    this.model.remove(this.model.toUpdate)
    //Model change
    this.model.add({time: this.$el.find("#time").val(), do: this.$el.find("#do").val()})
  }
})



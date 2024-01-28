require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


//home page

exports.homepage = async(req,res)=>{
  
try{
   const limitNumber=5;
   const categories = await Category.find({}).limit(limitNumber);
   
   const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
 

  const thai = await Recipe.find({'category':'Thai'}).sort({_id: -1}).limit(limitNumber);
  const american = await Recipe.find({'category':'American'}).sort({_id: -1}).limit(limitNumber);
  const chinese = await Recipe.find({'category':'Chinese'}).sort({_id: -1}).limit(limitNumber);

  const food = { latest,thai,american,chinese };

    res.render('index',{title:'Cooking BLOG',categories,food})
}catch(error){
    res.status(500).send({message: error.message || "error occured"})

}
 
};

 
//categories get


exports.exploreCategories= async(req,res)=>{
  
    try{
       const limitNumber=20;
       const categories = await Category.find({}).limit(limitNumber);
    
        res.render('categories',{title:'Cooking BLOG-categories',categories})
    }catch(error){
        res.status(500).send({message: error.message || "error occured"})
    
    }
    };

// categories by id

    exports.exploreCategoriesById= async(req,res)=>{
      
  
        try{
            let categoryId = req.params.id;
           
;           const limitNumber=7;
           const categoryById = await Recipe.find({'category':categoryId}).sort({_id: -1}).limit(limitNumber);
           
            res.render('explorecategories',{title:'Cooking BLOG-categories',categoryById,categoryId})
        }catch(error){
            res.status(500).send({message: error.message || "error occured"})
        
        }
        };



    //recipee
    
exports.exploreRecipe= async(req,res)=>{
  
    try{
    
      let recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
    
        res.render('recipe',{title:'Cooking BLOG-Recipe',recipe})
    }catch(error){
        res.status(500).send({message: error.message || "error occured"})
    
    }
     
    };

    
// search

    exports.searchRecipe= async(req,res)=>{
     try{
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({$text:{$search: searchTerm, $diacriticSensitive:true}});
        res.render('search',{title:'Cooking BLOG-search',recipe })
     }catch(error){
        res.status(500).send({message: error.message || "error occured"})
     }

        
    }

// explore-latest

exports.exploreLatest= async(req,res)=>{
    try{
       const limitNumber =20;
       const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
       res.render('explore-latest',{title:'Cooking BLOG-Explore Latest',recipe })
    }catch(error){
       res.status(500).send({message: error.message || "error occured"})
    }
   }

   //explore- random

exports.exploreRandom= async(req,res)=>{
    try{
      let count = await Recipe.find().countDocuments();
      let random =Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      
       res.render('explore-random',{title:'Cooking BLOG-Explore Random',recipe })
    }catch(error){
       res.status(500).send({message: error.message || "error occured"})
    }
   }

//submit page

exports.submitRecipe= async(req,res)=>{
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe',{title:'Cooking BLOG-Submit Recipe',infoErrorsObj ,infoSubmitObj  });
};


//submit page-post

exports.submitRecipeOnPost= async(req,res)=>{
    try{

       let imageUploadFile;
       let uploadPath;
       let newImageName;

      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No files where uploaded.')
      }else{
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;

        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

        imageUploadFile.mv(uploadPath,(err)=>{
            if(err) return res.status(500).send(err);
        })
      }


         const newRecipe = new Recipe({
            name: req.body.name,
            description:req.body.description,
            email:req.body.email,
            ingredients:req.body.ingredients,
            category:req.body.category,
            image:newImageName
         });

         await newRecipe.save();


        req.flash('infoSubmit','Recipe has been added.');
        res.redirect('/submit-recipe');

    }catch(error){
        req.flash('infoErrors',error);
        res.redirect('/submit-recipe');
    }
 
};


//delete recipe


// const deleteRecipe = async () => {
//     try {
//         await Recipe.deleteOne({ name: 'shawagoose' });
//     } catch (error) {
//         console.log(error);
//     }
// }

// deleteRecipe();


//update recipe

// const updateRecipe = async() => {
//     try{
//         const res = await Recipe.updateOne({name:'Indian Bun'},{name:'Indian Cake'})
//         res.n; //number of document matching
//         res.nModified; // number of document updated
//     }catch(error){
//         console.log(error);
//     }
// }
// updateRecipe();







// async function insertDymmycategoryData(){
//     try{
//         await Category.insertMany([
//             {
//                 "name":"Thai",
//                 "image":"thai-food.jpg"
//             },
//             {
//                 "name":"American",
//                 "image":"american-food.jpg"
//             },
//             {
//                 "name":"Chinese",
//                 "image":"chinese-food.jpg"
//             },
//             {
//                 "name":"Mexican",
//                 "image":"mexican-food.jpg"
//             },
//             {
//                 "name":"Indian",
//                 "image":"indian-food.jpg"
//             },
//             {
//                 "name":"Spanish",
//                 "image":"spanish-food.jpg"
//             },
//         ]);
//     }catch(error){
//       console.log('error' , + error)
//     }
// }

// insertDymmycategoryData();



// async function insertDymmyRecipeData(){
//         try{
//             await Recipe.insertMany([
//                       { 
//                         "name": "chinese-steak-tofu-stew",
//                         "description": `Recipe Description Goes Here`,
//                         "email": "reecipeemail@raddy.co.uk",
//                         "ingredients": [
//                           "1 level teaspoon baking powder",
//                           "1 level teaspoon cayenne pepper",
//                           "1 level teaspoon hot smoked paprika",
//                         ],
//                         "category": "Thai", 
//                         "image": "chinese-steak-tofu-stew.jpg"
//                       },
//                       { 
//                         "name": "southern-friend-chicken",
//                         "description": `Recipe Description Goes Here`,
//                         "email": "rwecipeemail@raddy.co.uk",
//                         "ingredients": [
//                           "1 level teaspoon baking powder",
//                           "1 level teaspoon cayenne pepper",
//                           "1 level teaspoon hot smoked paprika",
//                         ],
//                         "category": "Chinese", 
//                         "image": "southern-friend-chicken.jpg"
//                       },
//                       { 
//                         "name": "spring-rolls",
//                         "description": `Recipe Description Goes Here`,
//                         "email": "recipereemail@raddy.co.uk",
//                         "ingredients": [
//                           "1 level teaspoon baking powder",
//                           "1 level teaspoon cayenne pepper",
//                           "1 level teaspoon hot smoked paprika",
//                         ],
//                         "category": "Chinese", 
//                         "image": "spring-rolls.jpg"
//                       },
//                       { 
//                         "name": "thai-green-curry",
//                         "description": `Recipe Description Goes Here`,
//                         "email": "recipeemyail@raddy.co.uk",
//                         "ingredients": [
//                           "1 level teaspoon baking powder",
//                           "1 level teaspoon cayenne pepper",
//                           "1 level teaspoon hot smoked paprika",
//                         ],
//                         "category": "Thai", 
//                         "image": "thai-green-curry.jpg"
//                       },
//                       { 
//                         "name":" tom-daley",
//                         "description": `Recipe Description Goes Here`,
//                         "email": "recipeemaiyl@raddy.co.uk",
//                         "ingredients": [
//                           "1 level teaspoon baking powder",
//                           "1 level teaspoon cayenne pepper",
//                           "1 level teaspoon hot smoked paprika",
//                         ],
//                         "category": "Chinese", 
//                         "image": "tom-daley.jpg"
//                       },
//                       { 
//                         "name": "thai-style-mussels",
//                         "description": `Recipe Description Goes Here`,
//                         "email": "recipeehmail@raddy.co.uk",
//                         "ingredients": [
//                           "1 level teaspoon baking powder",
//                           "1 level teaspoon cayenne pepper",
//                           "1 level teaspoon hot smoked paprika",
//                         ],
//                         "category": "Thai", 
//                         "image": "thai-style-mussels.jpg"
//                       },
//                       { 
//                         "name": "thai-red-chicken-soup",
//                         "description": `Recipe Description Goes Here`,
//                         "email": "recipeejmail@raddy.co.uk",
//                         "ingredients": [
//                           "1 level teaspoon baking powder",
//                           "1 level teaspoon cayenne pepper",
//                           "1 level teaspoon hot smoked paprika",
//                         ],
//                         "category": "Thai", 
//                         "image": "thai-red-chicken-soup.jpg"
//                       },
//                       { 
//                         "name": "key-lime-pie",
//                         "description": `Recipe Description Goes Here`,
//                         "email": "recipeemailk@raddy.co.uk",
//                         "ingredients": [
//                           "1 level teaspoon baking powder",
//                           "1 level teaspoon cayenne pepper",
//                           "1 level teaspoon hot smoked paprika",
//                         ],
//                         "category": "Chinese", 
//                         "image": "key-lime-pie.jpg"
//                       },
//                     ]);
             
//         }catch(error){
//           console.log('error'  + error)
//         }
//     }
    
//     insertDymmyRecipeData();
    
    









// function insertData() {
//     Category.insertMany([
//         {
//             val: 'oll'
//         },
//         {
//             val: 'iii'
//         }
//     ])
//     .then((result) => {
//         console.log("Data inserted successfully:", result);
//     })
//     .catch((error) => {
//         console.error("Error inserting data:", error);
//     });
// }

// insertData();
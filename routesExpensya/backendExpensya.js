var express = require("express");
var router = express.Router();
var Schema = require("../models/CsvSchema");
const translate = require("@vitalets/google-translate-api");
const { json } = require("express");
var MemoKeys = require("../models/MemoKeys");

const mongoose = require("mongoose");

var stringSimilarity = require("string-similarity");


router.post("/translate", (req, res) => {
  console.log(req.body.aa);

  translate(req.body.aa, { to: "en" })
    .then((response) => {
      let data = { dataT: response.text, data: req.body.aa };
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.post("/autoMatchTran", (req, res) => {
  let element = req.body;
 
  const CsvSchema = new Schema({  
    id: element.file.id || element.file.idetifiant,
    firstname:
      element.file.name ||
      element.file.last_name ||
      element.file.lastname ||
      element.file.first_name,
    lastname: element.file.Last_name || element.file.Lastname || element.file.last_name,
    email: element.file.email || element.file.mail,
    gender: element.file.gender || element.file.genre,
  });
  CsvSchema.save()

    .then((x) => {
      res.status(201).json({
        message: "csv added successfully",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "failed !" + error,
      });
    });
  
});

router.post("/getSimilarity", (req, res) => {
  console.log(req.body);
  stringKey = req.body.data;
  systemKeys = ["id", "firstname", "lastname", "email", "gender", "Adresse_IP"];
  var headerSimilarityTab = [];
  res.json({
    similarity: stringSimilarity.findBestMatch(stringKey, systemKeys).bestMatch,
    key: stringKey,
  });
});



router.post("/autoMatchInit", (req, res) => {
element = req.body
elementKeys=Object.keys(req.body.file)
 
  firstNameFound = req.body.memoKeys.memoKeys[0].firstname.find(x=>x==elementKeys[1])
  idFound = req.body.memoKeys.memoKeys[0].id.find(x=>x==elementKeys[0])
  lastNameFound = req.body.memoKeys.memoKeys[0].lastname.find(x=>x==elementKeys[2])
  emailFound = req.body.memoKeys.memoKeys[0].email.find(x=>x==elementKeys[3])
  genderFound = req.body.memoKeys.memoKeys[0].gender.find(x=>x==elementKeys[4])


  const CsvSchema = new Schema({  
    id: element.file[idFound],
    firstname:element.file[firstNameFound],
    lastname: element.file[lastNameFound],
    email: element.file[emailFound],
    gender: element.file[genderFound],
  });
  CsvSchema.save()
    .then((x) => {
      res.status(201).json({
        message: "csv added successfully",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "failed !" + error,
      });
    });

})



router.post("/manMatch", (req, res) => {
  let element = req.body;
  console.log(element);

  const CsvSchema = new Schema({
    id: element.id,
    firstname: element.firstname,
    lastname: element.lastname,
    email: element.email,
    gender: element.gender,
  });
  CsvSchema.save()

    .then((x) => {
      res.status(201).json({
        message: "csv added successfully",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "failed !" + error,
      });
    });
});

router.get("/getMemoKeys", function (req, res, next) {
  MemoKeys.find().then((memoKeys) => {
    res.json({ memoKeys });
  });
});

router.post("/saveKeys", (req, res) => {
  console.log(req.body.matchingTab);
  idIndex = req.body.matchingTab.findIndex(
    (element) => element.systemKey == "id"
  );
  firstnameIndex = req.body.matchingTab.findIndex(
    (element) => element.systemKey == "firstname"
  );
  lastnameIndex = req.body.matchingTab.findIndex(
    (element) => element.systemKey == "lastname"
  );
  emailIndex = req.body.matchingTab.findIndex(
    (element) => element.systemKey == "email"
  );
  genderIndex = req.body.matchingTab.findIndex(
    (element) => element.systemKey == "gender"
  );
  memoKeys = req.body.memoKeys.memoKeys[0];
  console.log(memoKeys);
  if (!memoKeys) {
    const MemoKey = new MemoKeys({
      id: req.body.matchingTab[idIndex].csvKey,
      firstname: req.body.matchingTab[firstnameIndex].csvKey,
      lastname: req.body.matchingTab[lastnameIndex].csvKey,
      email: req.body.matchingTab[emailIndex].csvKey,
      gender: req.body.matchingTab[genderIndex].csvKey,
    });
    MemoKey.save()
      .then((x) => {
        res.status(201).json({
          message: "key added successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "failed !" + error,
        });
      });
  } else {
    memoKeys.id.push(req.body.matchingTab[idIndex].csvKey);
    memoKeys.firstname.push(req.body.matchingTab[firstnameIndex].csvKey);
    memoKeys.lastname.push(req.body.matchingTab[lastnameIndex].csvKey);
    memoKeys.email.push(req.body.matchingTab[emailIndex].csvKey);
    memoKeys.gender.push(req.body.matchingTab[genderIndex].csvKey);
    console.log("added");
    res.json(memoKeys);
  }
});

router.put("/updateMemoKeys/:id", (req, res, next) => {
  MemoKeys.findByIdAndUpdate(req.params.id, req.body).then((y) => {
    res.json({
      message: "updated",
    });
    console.log(req.body);
  });
});

router.get("/getCsvFile", function (req, res, next) {
  Schema.find().then((csvFile) => {
    res.json(csvFile);
  });
});

module.exports = router;

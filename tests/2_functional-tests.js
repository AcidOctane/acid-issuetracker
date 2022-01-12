const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
//X Create an issue with every field: POST request to /api/issues/{project}X
//X Create an issue with only required fields: POST request to /api/issues/{project}X
//X Create an issue with missing required fields: POST request to /api/issues/{project}
// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}
let deleteID;
suite('Functional Tests', ()=> {
  suite('Routing tests', ()=>{
    suite('POST', ()=>{
      test('Create an issue with every field', function(done){
        chai
          .request(server)
          .post('/api/issues/projects')
          .set("content-type", "application/json")
          .send({
            issue_title: "Issue",
            issue_text: "Functioanal Test",
            created_by: "octane",
            assigned_to: "tester",
            status_text: "Not done"
          })
          .end((err, res)=>{
            assert.equal(res.status, 200);
            deleteID = res.body._id;
            assert.equal(res.body.issue_title, "Issue");
            assert.equal(res.body.assigned_to, "tester");
            assert.equal(res.body.created_by, "octane");
            assert.equal(res.body.status_text, "Not done");
            assert.equal(res.body.issue_text, "Functioanal Test");
            done();
          });
      });

      test("Create an issue with only required fields", function(done){
        chai
          .request(server)
          .post('/api/issues/projects')
          .set("content-type", "application/json")
          .send({
            issue_title: "Issue",
            issue_text: "Functional Test",
            created_by: "octane",

          })
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Issue");
            assert.equal(res.body.issue_text, "Functional Test");
            assert.equal(res.body.created_by, "octane");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.status_text, "");
            done();
          });
      })

      test.only("Create an issue with missing required fields", function(done){
        chai
          .request(server)
          .post('/api/issues/projects')
          .set("content-type", "application/json")
          .send({
            issue_title: "Issue",
            issue_text: "Functional Test",
          })
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "required field(s) missing");
            done();
          });
      })

    })
  })
});

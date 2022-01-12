const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
//X Create an issue with every field: POST request to /api/issues/{project}X
//X Create an issue with only required fields: POST request to /api/issues/{project}X
//X Create an issue with missing required fields: POST request to /api/issues/{project}
//X  View issues on a project: GET request to /api/issues/{project}
//x View issues on a project with one filter: GET request to /api/issues/{project}
//x View issues on a project with multiple filters: GET request to /api/issues/{project}
//x Update one field on an issue: PUT request to /api/issues/{project}
//x Update multiple fields on an issue: PUT request to /api/issues/{project}
//x Update an issue with missing _id: PUT request to /api/issues/{project}
//x Update an issue with no fields to update: PUT request to /api/issues/{project}
//x Update an issue with an invalid _id: PUT request to /api/issues/{project}
//x Delete an issue: DELETE request to /api/issues/{project}
//x Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
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
            issue_text: "Functional Test",
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
            assert.equal(res.body.issue_text, "Functional Test");
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
      test("Create an issue with missing required fields", function(done){
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

    suite('GET', ()=>{
      test('View issues on a project', (done) => {
        chai
        .request(server)
        .get("/api/issues/fcc-project/")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 37);
          done();
        })
      })
      test('View issues on a project with one filter', (done) => {
        chai
        .request(server)
        .get("/api/issues/fcc-project/")
        .query({
          issue_title: "Faux Issue Title",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body[0], {

            issue_title: 'Faux Issue Title',
            issue_text: 'Functional Test - Required Fields Only',
            created_on: '2022-01-11T13:54:45.773Z',
            updated_on: '2022-01-11T13:54:45.773Z',
            created_by: 'fCC',
            open: true,
            status_text: "",
            _id: '61dd8c25ebbb0e094bc6243c',
          }
          );
          done();
        })
      })
      test('View issues on a project with multiple filters', (done) => {
        chai
        .request(server)
        .get("/api/issues/get_issues_test_309796/")
        .query({
          issue_text: "Get Issues Test",
          issue_title: 'Faux Issue 1',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body[0], {
            issue_title: 'Faux Issue 1',
            issue_text: 'Get Issues Test',
            created_on: '2022-01-11T14:11:49.856Z',
            updated_on: '2022-01-11T14:11:49.856Z',
            created_by: 'fCC',
            open: true,
            status_text: "",
            _id: '61dd9025fe23c2fec0f4afe1',
          }
          );
          done();
        })
      })
    })

    suite('PUT', ()=>{
      test('Update one field on an issue', function(done){
        chai
          .request(server)
          .put('/api/issues/projects')
          .send({
            _id: deleteID,
            issue_title: "Updated Issue"
          })
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, deleteID);
            done();
          });
      });
      test('Update multiple fields on an issue', function(done){
        chai
          .request(server)
          .put('/api/issues/projects')
          .send({
            _id: deleteID,
            issue_text: "Updated Issue Text",
            assigned_to: "Updated tester",
            created_by: "FunctionalTest"
          })
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, deleteID);
            done();
          });
      });
      test('Update an issue with missing _id', function(done){
        chai
          .request(server)
          .put('/api/issues/projects')
          .send({
            issue_text: "Updated Issue Text",
            assigned_to: "Updated tester",
            created_by: "FunctionalTest"
          })
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
          });
      });
      test('Update an issue with no fields to update', function(done){
        chai
          .request(server)
          .put('/api/issues/projects')
          .send({
            _id: deleteID,
          })
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent");
            done();
          });
      });
      test('Update an issue with an invalid _id', function(done){
        chai
          .request(server)
          .put('/api/issues/projects')
          .send({
            _id: 'eeed9025fe23c2fec0f4aeee',
            issue_text: "Updated Issue Text",
            assigned_to: "Updated tester",
            created_by: "FunctionalTest",
          })
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not update");
            done();
          });
      });
    })

    suite('DELETE', ()=>{
      test('Delete an issue', function(done){
        chai
          .request(server)
          .delete('/api/issues/projects')
          .send({
            _id: deleteID,
          })
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");
            done();
          });
      });
      test('Delete an issue with an invalid _id:', function(done){
        chai
          .request(server)
          .delete('/api/issues/projects')
          .send({
            _id: "eeed9025fe23c2fec0f4aeee",
          })
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not delete");
            done();
          });
      });
      test('Delete an issue with missing _id:', function(done){
        chai
          .request(server)
          .delete('/api/issues/projects')
          .send({})
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
          });
      });
    });
  })
});

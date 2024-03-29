import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import React from "react";
import { Modal } from "react-bootstrap";
import "../../style/userTable.css";
import { FileDownload } from "@mui/icons-material";
import { UserContext } from "../../App";
import getFullyQualifiedUrl from "../../helpers/host";

/**
 * uploadUrl: The RELATIVE URL to upload the file to, MUST start with a slash, e.g. /api/users/import 
 */
function ImportForm({ taskName, uploadUrl, label = "Choose the CSV file and upload it to import the data.", fetchData }: { taskName: string, uploadUrl: string, label?: string, fetchData: Function }) {
  const { user } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [file, setFile] = useState();

  function handleChange(e) {
    setFile(e.target.files[0]);
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShow(false);
    const formData = new FormData();
    formData.append('csvFile', file);
    try {
      // CAUTION: Do not hard code the URLs, rather use routers
      const res = await fetch(getFullyQualifiedUrl(uploadUrl), {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error);

    } catch (err) {
      alert(err.message || "Something went wrong");
    }

    fetchData();
  };

  return (
    <div id="ta-review-modal">
      <button className="courses" onClick={() => setShow(true)}>
        <FileDownload /> Import
      </button>

      <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-md" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">{`Import ${taskName}`}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>{label}</Form.Label>
              <Form.Control required type="file" name="csvFile" onChange={(e) => handleChange(e)} />
            </Form.Group>

            <Button variant="outline-secondary" type="submit">
              Upload
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ImportForm;

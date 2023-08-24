import React, { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ToastContext from "../context/ToastContext";
import { Link, useNavigate } from "react-router-dom";

function AllContacts() {
  const navigate = useNavigate();
  const { toast } = useContext(ToastContext);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://contactapp-backend.onrender.com/api/mycontacts`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await res.json();
        if (!result.error) {
          setContact(result.contacts);
          setLoading(false);
        } else {
          console.log(result);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const deleteContact = async (id, name) => {
    if (window.confirm(`Are you sure do you want to delete ${name} contact`)) {
      try {
        const res = await fetch(
          `https://contactapp-backend.onrender.com/api/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await res.json();
        if (!result.error) {
          setContact(result.myContacts);
          toast.success(`${name} contact deleted successfully`);
          setShowModal(false);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div>
        <h1>Your Contacts</h1>
        <hr className="my-4" />
        {loading ? (
          <Spinner splash="Loading Contacts..." />
        ) : (
          <>
            {contact.length === 0 ? (
              <>
                <h3>No Contacts Here to Show</h3>{" "}
                <a
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate("/create", { replace: true })}
                >
                  Create new contact
                </a>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="searchInput"
                  id="searchInput"
                  className="form-control my-3"
                  placeholder="Search Contact"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <p>Total Contacts : {contact.length}</p>
                <div className=" table-responsive col-lg-12">
                  <table className="table table-light table-stripped table-hover ">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Address</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                      </tr>
                    </thead>
                    <tbody style={{ cursor: "pointer" }}>
                      {contact
                        .filter((item) => {
                          return searchInput.toLowerCase() === ""
                            ? item
                            : item.name
                                .toLowerCase()
                                .includes(searchInput.toLowerCase());
                        })
                        .map((person) => (
                          <tr
                            key={person._id}
                            onClick={() => {
                              setModalData({});
                              setModalData(person);
                              setShowModal(true);
                            }}
                          >
                            <th scope="row">{person.name}</th>
                            <td>{person.address}</td>
                            <td>{person.email}</td>
                            <td>{person.phone}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div
        className="modal show"
        style={{ display: "block", position: "initial" }}
      >
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{modalData.name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>
              <strong>Address: </strong>
              {modalData.address}
            </p>
            <p>
              <strong>Email: </strong>
              {modalData.email}
            </p>
            <p>
              <strong>PhoneNo: </strong>
              {modalData.phone}
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Link className="btn btn-info" to={`/edit/${modalData._id}`}>
              Edit
            </Link>
            <Button
              variant="danger"
              onClick={() => deleteContact(modalData._id, modalData.name)}
            >
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default AllContacts;

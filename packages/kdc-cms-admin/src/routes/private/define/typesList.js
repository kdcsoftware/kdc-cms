/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import moment from 'moment';
import { useContentTypeList } from '../../../context/contentTypeList';
import RowSpinner from '../../../components/rowSpinner';
import Table from '../../../components/table';
import api from '../../../utils/api';

const formatDate = ({ createdAt, updatedAt }) => {
  let ts = 0;
  if (updatedAt) ts = updatedAt;
  else if (createdAt) ts = createdAt;

  if (ts === 0) return '';

  return moment(ts).format('MMM D, YYYY h:mma');
};

const TypesList = () => {
  const { typeList, fetchList } = useContentTypeList();
  const [isLoading, setIsLoading] = useState(false);

  const deletePage = (type) => {
    const r = confirm(
      'Are you sure you want to delete this content type?\nAll data associated with this content type will also be deleted.\n\nTHIS CANNOT BE UNDONE!'
    );
    if (r === true) {
      setIsLoading(true);
      api(`define/contents/${type}`, { method: 'DELETE' })
        .then(fetchList)
        .then(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchList().then(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <h3 className="m-0">List</h3>
        <Link to="add" className="btn btn-sm btn-primary">
          Add Type
        </Link>
      </CardHeader>
      <CardBody>
        <Table hover striped responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type Name</th>
              <th>Description</th>
              <th className="text-center">Fields</th>
              <th>Last Modified</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <RowSpinner colSpan={6} />
            ) : (
              typeList.map((type) => (
                <tr key={type.id}>
                  <th scope="row">{type.id}</th>
                  <td>{type.name}</td>
                  <td>{type.description}</td>
                  <td className="text-center">{type.fieldCount}</td>
                  <td>{formatDate(type)}</td>
                  <td className="text-center">
                    <Link to={`edit/${type.id}`} className="btn btn-sm btn-secondary mr-2">
                      Edit
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      color="danger"
                      onClick={() => deletePage(type.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default TypesList;

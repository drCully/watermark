import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTimesheetDate,
  previousDate,
  nextDate,
} from '../../redux/slices/session';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaFileAlt,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaRegEdit,
  FaRegTrashAlt,
} from 'react-icons/fa';
import Pagination from '@material-ui/lab/Pagination';
import {
  useTimesQuery,
  useDeleteTimeMutation,
} from '../../services/timekeeperApi';

const Timesheet = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const timekeeper = currentUser.id;
  const { timesheetDate } = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const pageSizes = [10, 15, 20];

  const {
    data: timeRecords,
    isLoading,
    error,
  } = useTimesQuery(
    `page=${
      page - 1
    }&size=${perPage}&date=${timesheetDate}&timekeeper=${timekeeper}`
  );

  const [deleteTime] = useDeleteTimeMutation();

  useEffect(() => {
    if (error) {
      toast.error('Something went wrong');
    }
  }, [error]);

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  const handleDateChange = (e) => {
    dispatch(setTimesheetDate(e.target.value));
  };

  const handlePageChange = (e) => {
    setPage(e.target.value);
  };

  const handlePageSizeChange = (e) => {
    setPerPage(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this time record? ')) {
      await deleteTime(id);
      toast.success('Time Record Deleted Successfully');
    }
  };

  return (
    <div>
      <div className='col-md-12 m-auto'>
        <div className=''>
          <div className='col text-nowrap'>
            <h4>Timesheet</h4>
          </div>
          <div className='d-flex justify-content-end'>
            <FaChevronCircleLeft
              type='button'
              className='text-secondary fs-3 my-auto m-2'
              onClick={() => dispatch(previousDate())}
            />
            <div className='col-md-2'>
              <div>
                <input
                  type='date'
                  className='form-control'
                  id='timesheetDate'
                  name='timesheetDate'
                  value={timesheetDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <FaChevronCircleRight
              type='button'
              className='text-secondary fs-3 my-auto m-2'
              onClick={() => dispatch(nextDate())}
            />
            <Link
              to={'/timeadd'}
              className='btn btn-primary btn-sm text-nowrap my-auto m-3'
            >
              Add Time
            </Link>
            <FaFileAlt
              type='button'
              className='text-success fs-4 my-auto m-2'
            />
          </div>
        </div>

        {timeRecords.totalItems > 0 ? (
          <div>
            <table className='table table-sm table-striped table-hover mt-2'>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Task</th>
                  <th>Hours</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {timeRecords?.data.map((item, index) => {
                  return (
                    <tr key={item._id}>
                      <td>{item.client.clientname}</td>
                      <td>{item.task.taskname}</td>
                      <td>{item.hours}</td>
                      <td>{item.description}</td>
                      <td>
                        <Link to={`/timeedit/${item._id}`}>
                          <FaRegEdit className='text-success fs-6 me-4' />
                        </Link>
                        <FaRegTrashAlt
                          className='text-danger fs-6 me-4'
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleDelete(item._id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {timeRecords.totalPages > 1 && (
              <div className='d-flex'>
                <div className='col-md-3 ms-3 me-auto'>
                  {'Items per Page: '}
                  <select onChange={handlePageSizeChange} value={perPage}>
                    {pageSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <Pagination
                  className='me-3'
                  count={timeRecords?.totalPages}
                  page={page}
                  siblingCount={1}
                  boundaryCount={1}
                  variant='outlined'
                  shape='rounded'
                  onChange={handlePageChange}
                />
              </div>
            )}
          </div>
        ) : (
          <h5 className='text-center text-secondary fst-italic mt-3'>
            - No time records to display -
          </h5>
        )}
      </div>
    </div>
  );
};

export default Timesheet;

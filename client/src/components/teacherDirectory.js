import React from 'react';
import TeacherCard from './teacherCard.js';

const TeacherDirectory = ({ teacherDataList }) => {
  return (
    <div className="container-fluid py-4">
        <h3 className="mb-4 text-center text-secondary">Available Teachers</h3>
        <div className="row justify-content-center">
        {teacherDataList.map((teacher) => (
            <div key={teacher.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
                <TeacherCard teacherData={teacher} />
            </div>
        ))}
        </div>
    </div>
  );
};

export default TeacherDirectory;
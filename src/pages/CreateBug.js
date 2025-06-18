import React from "react";

const CreateBug = () => 
        <div className="create-bug-container flex flex-col items-center">
            <div className="create-bug-header mb-4">
                <h1 className="text-2xl font-bold">Create a New Bug</h1>
                <p className="text-gray-600">Fill out the form below to report a new bug.</p>
            </div>
            <div className="create-bug-image">
                <img src="/images/bug-icon.png" alt="Bug Icon" className="w-24 h-24" />
            <form className="create-bug-form bg-white p-4">
                <div className="form-group flex gap-2">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" required />
                </div>
                <div className="form-group flex ">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" required></textarea>
                </div>
                <button type="submit">Create Bug</button>
            </form>
            </div>
            <div className="create-bug-footer mt-6">
                <p className="text-gray-500">Thank you for helping us improve our application!</p>
            </div>
        </div>
export default CreateBug;

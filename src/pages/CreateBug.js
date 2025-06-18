import React from "react";

const CreateBug = () => 
        <div className="create-bug-container flex flex-col gap-3  p-4">
            <div className="create-bug-header mb-4">
                <h1 className="text-2xl font-bold">Create a New Bug</h1>
                <p className="text-gray-600">Fill out the form below to report a new bug.</p>
            </div>
            <div className="create-bug-image flex w-full justify-center">
            <form className="create-bug-form flex flex-col w-1/2 gap-4 p-4">
                <div className="form-group w-full flex gap-2">
                    <label className="w-full" htmlFor="title">Title:</label>
                    <input className="w-full" type="text" id="title" name="title" required />
                </div>
                <div className="form-group flex gap-2">
                    <label className="w-full" htmlFor="priority">Priority:</label>
                    <select className="w-full" id="priority" name="priority" required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="form-group flex gap-2">
                    <label className="w-full" htmlFor="status">Status:</label>
                    <select className="w-full" id="status" name="status" required>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="in-review">In Review</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                <div className="form-group flex gap-2">
                    <label className="w-full" htmlFor="assignee">Assignee:</label>
                    <input className="w-full" type="text" id="assignee" name="assignee" placeholder="Optional" />
                </div>
                <div className="form-group flex gap-2">
                    <label className="w-full" htmlFor="dueDate">Due Date:</label>
                    <input className="w-full" type="date" id="dueDate" name="dueDate" />
                </div>
                <div className="form-group flex gap-2">
                    <label className="w-full" htmlFor="createdAt">Created At:</label>
                    <input className="w-full" type="datetime-local" id="createdAt" name="createdAt" />
                </div>
                <div className="form-group flex gap-2">
                    <label className="w-full" htmlFor="attachments">Attachments:</label>
                    <input className="w-full" type="file" id="attachments" name="attachments" multiple />
                </div>
                <div className="form-group flex ">
                    <label className="w-full" htmlFor="description">Description:</label>
                    <textarea className="w-full" id="description" name="description" required></textarea>
                </div>
                <div className= "form-group flex justify-center items-center gap-2">
                <button className="bg-black text-white p-2 rounded " type="submit">Create Bug</button>
                </div>
            </form>
            </div>
            <div className="create-bug-footer mt-6">
                <p className="text-gray-500">Thank you for helping us improve our application!</p>
            </div>
        </div>
export default CreateBug;

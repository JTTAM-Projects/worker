export default function ProfileSkillsSection() {
    return(
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-3">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">Customer Service</span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">Project Management</span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">Event Planning</span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">Administrative Support</span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">Communication</span>
            </div>
        </div>
    )
}
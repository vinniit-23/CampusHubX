import { useState, useEffect } from "react";
import { skillsApi } from "../../services/api/skills";
import { studentsApi } from "../../services/api/students";
import Card from "../../components/common/Card/Card";
import Spinner from "../../components/common/Spinner/Spinner";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import Badge from "../../components/common/Badge/Badge";
import toast from "react-hot-toast";
import { SKILL_CATEGORIES } from "../../utils/constants";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("technical"); // Default for creation

  useEffect(() => {
    fetchSkills();
    fetchAvailableSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await studentsApi.getSkills();
      setSkills(response || []);
    } catch (error) {
      console.error("Error fetching user skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSkills = async () => {
    try {
      const response = await skillsApi.getAll();
      if (response.success) {
        setAvailableSkills(response.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching global skills:", error);
    }
  };

  // 1. Add Existing Skill
  const handleAddExistingSkill = async (skillId) => {
    try {
      await studentsApi.addSkill(skillId);
      toast.success("Skill added successfully");
      refreshData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add skill");
    }
  };

  // 2. Create AND Add New Skill
  const handleCreateAndAddSkill = async () => {
    if (!searchQuery.trim()) return;

    try {
      // Step A: Create the skill in the global DB
      const createResponse = await skillsApi.create({
        name: searchQuery,
        category: selectedCategory,
        description: `Created by student`,
      });

      if (createResponse.success) {
        const newSkillId = createResponse.data._id;

        // Step B: Add it to the student profile
        await studentsApi.addSkill(newSkillId);

        toast.success(`Skill "${searchQuery}" created and added!`);
        refreshData();
        setSearchQuery(""); // Clear search
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error?.message || "Failed to create skill"
      );
    }
  };

  const refreshData = () => {
    fetchSkills();
    fetchAvailableSkills();
  };

  // Filter Logic
  const filteredSkills = availableSkills.filter((skill) => {
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const notAlreadyAdded = !skills.some((s) => s._id === skill._id);
    return matchesSearch && notAlreadyAdded;
  });

  const exactMatchExists = filteredSkills.some(
    (s) => s.name.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
          <p className="mt-2 text-gray-600">Build your skill profile</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Skill</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <Card key={skill._id} hover>
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {skill.name}
                    </h3>
                    <Badge variant="info" className="mt-2 capitalize">
                      {skill.category}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
          {skills.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500">Your skill list is empty.</p>
              <Button variant="link" onClick={() => setModalOpen(true)}>
                Add your first skill
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ADD SKILL MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Skill"
        size="lg"
      >
        <div className="space-y-4">
          {/* Search / Create Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search or type a new skill
            </label>
            <input
              type="text"
              placeholder="e.g. React, Python, Public Speaking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              autoFocus
            />
          </div>

          {/* List of Matches */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredSkills.map((skill) => (
              <div
                key={skill._id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAddExistingSkill(skill._id)}
              >
                <div>
                  <h4 className="font-medium text-gray-900 capitalize">
                    {skill.name}
                  </h4>
                  <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                    {skill.category}
                  </span>
                </div>
                <Button size="sm" variant="ghost">
                  Add +
                </Button>
              </div>
            ))}
          </div>

          {/* CREATE NEW SKILL UI */}
          {searchQuery && !exactMatchExists && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mt-4">
              <p className="text-sm text-blue-800 mb-3">
                Skill "<strong>{searchQuery}</strong>" not found. Create it?
              </p>

              <div className="flex gap-2 items-center">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  {Object.values(SKILL_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>

                <Button size="sm" onClick={handleCreateAndAddSkill}>
                  Create & Add "{searchQuery}"
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Skills;

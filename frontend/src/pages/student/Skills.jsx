import { useState, useEffect } from 'react';
import { skillsApi } from '../../services/api/skills';
import { studentsApi } from '../../services/api/students';
import Card from '../../components/common/Card/Card';
import Spinner from '../../components/common/Spinner/Spinner';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import Badge from '../../components/common/Badge/Badge';
import toast from 'react-hot-toast';
import { SKILL_CATEGORIES } from '../../utils/constants';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchSkills();
    fetchAvailableSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await studentsApi.getSkills();
      setSkills(response || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSkills = async () => {
    try {
      const response = await skillsApi.getAll();
      if (response.success) {
        setAvailableSkills(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching available skills:', error);
    }
  };

  const handleAddSkill = async (skillId) => {
    try {
      await studentsApi.addSkill(skillId);
      toast.success('Skill added successfully');
      fetchSkills();
      setModalOpen(false);
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const filteredSkills = selectedCategory
    ? availableSkills.filter((skill) => skill.category === selectedCategory)
    : availableSkills;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
          <p className="mt-2 text-gray-600">Manage your skills and expertise</p>
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
                    <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                    <Badge variant="info" className="mt-2">
                      {skill.category}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Skill" size="lg">
        <div className="space-y-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Categories</option>
            {Object.values(SKILL_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredSkills
              .filter((skill) => !skills.some((s) => s._id === skill._id))
              .map((skill) => (
                <div
                  key={skill._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium">{skill.name}</h4>
                    <p className="text-sm text-gray-500">{skill.category}</p>
                  </div>
                  <Button size="sm" onClick={() => handleAddSkill(skill._id)}>
                    Add
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Skills;

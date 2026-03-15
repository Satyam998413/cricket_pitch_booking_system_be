const generateSlots = () => {

  const slots = [];

  for (let i = 6; i < 22; i++) {
    slots.push(`${i}:00-${i+1}:00`);
  }

  return slots;
};

export default generateSlots;
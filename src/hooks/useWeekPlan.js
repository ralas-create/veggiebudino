import useSyncedState from './useSyncedState'

const emptyPlan = {
  mon: { lunch: null, dinner: null },
  tue: { lunch: null, dinner: null },
  wed: { lunch: null, dinner: null },
  thu: { lunch: null, dinner: null },
  fri: { lunch: null, dinner: null },
  sat: { lunch: null, dinner: null },
  sun: { lunch: null, dinner: null },
}

export default function useWeekPlan() {
  const [plan, setPlan] = useSyncedState('veggiebudino-weekplan', { ...emptyPlan })

  const setMeal = (day, meal, recipeId) => {
    setPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: recipeId }
    }))
  }

  const clearPlan = () => setPlan({ ...emptyPlan })

  const applyGeneratedPlan = (generatedPlan) => {
    setPlan(generatedPlan)
  }

  return { plan, setMeal, clearPlan, applyGeneratedPlan }
}

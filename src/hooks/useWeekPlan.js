import useSyncedState from './useSyncedState'

const emptyPlanNormal = {
  mon: { lunch: null, dinner: null },
  tue: { lunch: null, dinner: null },
  wed: { lunch: null, dinner: null },
  thu: { lunch: null, dinner: null },
  fri: { lunch: null, dinner: null },
  sat: { lunch: null, dinner: null },
  sun: { lunch: null, dinner: null },
}

const emptyPlanSibo = {
  mon: { breakfast: null, snack1: null, lunch: null, snack2: null, dinner: null },
  tue: { breakfast: null, snack1: null, lunch: null, snack2: null, dinner: null },
  wed: { breakfast: null, snack1: null, lunch: null, snack2: null, dinner: null },
  thu: { breakfast: null, snack1: null, lunch: null, snack2: null, dinner: null },
  fri: { breakfast: null, snack1: null, lunch: null, snack2: null, dinner: null },
  sat: { breakfast: null, snack1: null, lunch: null, snack2: null, dinner: null },
  sun: { breakfast: null, snack1: null, lunch: null, snack2: null, dinner: null },
}

function getEmptyPlan() {
  const isSibo = localStorage.getItem('veggiebudino-sibo') === 'true'
  return isSibo ? { ...emptyPlanSibo } : { ...emptyPlanNormal }
}

export default function useWeekPlan() {
  const [plan, setPlan] = useSyncedState('veggiebudino-weekplan', getEmptyPlan())

  const setMeal = (day, meal, recipeId) => {
    setPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: recipeId }
    }))
  }

  const clearPlan = () => setPlan(getEmptyPlan())

  const applyGeneratedPlan = (generatedPlan) => {
    setPlan(generatedPlan)
  }

  return { plan, setMeal, clearPlan, applyGeneratedPlan }
}

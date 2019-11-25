import {Difficulty} from "~/types";
import {Difficulty} from "~/types";
import {Difficulty} from "~/types";
import {Difficulty} from "~/types";
<template>
  <div class="container">
    <div v-if="exercises.length === 0">{{status}}</div>
    <template v-else>
      <h1 class="header">&#129409;&#128170; The Arnold'cise - Get T R A I N I N G ! &#128293;&#128293;</h1>
      <p>Every exercise is done in the sets with 8 reps in each set. The weight is fixed.</p>

      <div class="exercise-container">
        <button v-if="!workoutStarted" v-on:click="nopesNewData()" class="new-workout">Hell no!
          Ny plan
        </button>
        <div class="exercise-row" v-for="workoutItem in exercises" v-bind:key="workoutItem.order"
             v-bind:class="{active: currentWorkoutItem.order == workoutItem.order, 'in-active': currentWorkoutItem.order < workoutItem.order}">
          <div class="order">{{workoutItem.order}}.</div>
          <span class="group">{{workoutItem.exercise.group}}</span>
          <div class="exercise">{{workoutItem.exercise.name}}</div>
          <a class="video" v-if="workoutItem.exercise.link" :href="workoutItem.exercise.link">&#128250;</a>
          <div class="training">
            <input type="number" size="1" min="0" :step="workoutItem.exercise.step"
                   v-model="workoutItem.exercise.amount"><span>{{workoutItem.exercise.units}}</span>
          </div>
          <template v-if="workoutStarted">
            <div class="difficulty">
              <div>Difficulty</div>
              <template v-for="difficulty in difficulties">
                <input type="radio" :id="difficulty" :value="difficulty" v-model="workoutItem.difficulty"
                       :class="'difficulty-'+difficulty">
              </template>
            </div>
          </template>
        </div>
      </div>
      <button v-if="!workoutStarted" v-on:click="startWorkout()">Hell yes! Crunch TIME</button>
      <button v-if="workoutStarted" v-on:click="saveWorkout()">Save workout</button>
      <button v-if="workoutSaved" v-on:click="nopesNewData()">Get new program</button>
    </template>

    <a class="read-more" href="https://www.bodybuilding.com/content/the-full-body-workout-for-extreme-fitness.html">
      Læs mere</a>

    <div class="workouts" v-if="workouts.length>0">
      <h3>Previous workouts</h3>
      <div v-for="workout in workouts">
        {{workout.date}}
      </div>
    </div>
  </div>


</template>

<script lang="ts">
    /*
# TODOS
## Split training log and personal trainer
## Add timer function
## Voice control of next, start, stop, more weight

*/
    import Logo from '~/components/Logo.vue'
    import shuffle from 'lodash/shuffle'
    import Vue from 'vue'
    import * as exercises from '~/static/exercises.json'
    import {Difficulty, Exercise, Workout, WorkoutItem} from "~/types";

    const StorageKey = "TrainingDataStuff";

    export default Vue.extend({

        data() {
            const workouts: Workout[] = [];
            if (process.client) {
                // SHOULD NOT BLOCK INITIAL RENDER
                const data = window.localStorage.getItem("Workouts")
                if (data) {
                    console.log("Workouts loaded", {Workouts: data})
                    workouts.push(...JSON.parse(data));
                }
            }

            const exercises: WorkoutItem[] = [];
            const status = "loading";
            let workoutStarted: boolean = false;
            let workoutSaved: boolean = false;
            let difficulties = [Difficulty.veryEasy, Difficulty.easy, Difficulty.medium, Difficulty.hard, Difficulty.veryDifficult];
            return {
                status,
                exercises,
                workouts,
                difficulties,
                workoutStarted,
                workoutSaved
            }
        },

        computed: {
            // need annotation
            currentWorkoutItem(): WorkoutItem | undefined {
                let item = this.exercises.find(e => e.difficulty == null);
                if (item) return item;
                return this.exercises[this.exercises.length - 1];
            }
        },
        created: function () {
            this.loadData().then(exercises => {
                if (exercises)
                    return exercises;
                return this.createData();
            }).then(exercises => {
                this.saveData(exercises)
                this.exercises = exercises;
                this.status = "loaded"
            }).catch(error => {
                this.status = "Whoops - An error happened :O"
                console.error(error);
            })
        },


        methods: {

            nopesNewData: function () {
                this.workoutStarted = false;
                this.workoutSaved = false;
                this.createData().then(exercises => {
                    this.exercises = exercises;
                    this.saveData(exercises);
                })
            },

            startWorkout: function () {
                this.workoutStarted = true
            },

            saveWorkout: function () {
                let workout = {
                    date: new Date(),
                    exercises: this.exercises.map(e => ({exercise: e.exercise, difficulty: 1}))
                } as Workout;
                this.workouts.push(workout);
                if (process.client) {
                    window.localStorage.setItem("Workouts", JSON.stringify(this.workouts))
                }
            },


            createData: async function (): Promise<WorkoutItem[]> {
                if (process.client) {
                    const items = await fetch("/exercises.json").then(response => response.json());
                    console.log(items);
                    let index = 0;
                    const exercises = shuffle(items).map((exercise: Exercise) => ({
                        exercise: exercise,
                        order: ++index,
                        difficulty: undefined
                    } as WorkoutItem));
                    return exercises;
                }
                return exercises;
            },


            loadData: async function (): Promise<WorkoutItem[] | null> {
                if (process.client) {
                    const storageData = window.localStorage.getItem(StorageKey)
                    if (storageData) {
                        return JSON.parse(storageData);
                    }
                }
                return null;
            },

            saveData: function (exercises: WorkoutItem[]) {
                if (process.client)
                    window.localStorage.setItem(StorageKey, JSON.stringify(exercises))
            }
        },
        components: {
            Logo
        }
    })
</script>

<style lang="scss">
  :root {
    --background-color: #3b8070;
    --text-color: goldenrod;
    --box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

    color: var(--text-color);
  }

  .new-workout {
    top: 0;
    right: 0;
    position: absolute;
  }

  .container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: var(--background-color);
  }

  .difficulty-1 {
    background: darkred;
  }

  input {
    text-align: right;
    width: 40px;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  }

  p,
  .header { margin-bottom: 1rem; }


  .exercise-container {
    background: white;
    padding: 1rem;
    border-radius: 6px;
    box-shadow: var(--box-shadow);
    position: relative;
  }

  input.selected {
    color: green;
  }

  .exercise-row {
    display: grid;
    /*padding: 2rem;*/
    grid-template-areas: 'order group group group'       'order video exercise training' 'order difficulty difficulty difficulty' ;
    grid-column-gap: 5px;
    align-items: center;
    justify-content: start;
    margin-bottom: 1rem;
    justify-items: start;


    .order { grid-area: order;
      color: white;
      font-weight: bold;
      background: grey;
      width: 40px;
      height: 40px;
      align-items: center;
      display: flex;
      justify-content: center;
    margin-right: 10px;
      align-self: start;
    }
    &.active .order {
      background:#3b8070;
    }

    &.in-active .order {
      background:lightgray;
    }

    .group { grid-area: group; }

    .exercise { grid-area: exercise; }

    .video { grid-area: video; }

    .training { grid-area: training; }
    .difficulty { grid-area: difficulty; }

    .exercise { line-height: 1rem; }

    .group {
      width: auto;
      font-size: .6rem;
      background: #3b8070;
      color: white;
      font-weight: bold;
      border-radius: 5px;
      padding: 0 4px 2px;
    }
  }


  .read-more {
    margin-top: 1rem;
    font-size: .6rem;
    color: var(--text-color);
    text-decoration: none;
  }

</style>

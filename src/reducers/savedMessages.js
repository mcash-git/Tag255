import * as types from 'constants/ActionTypes';

const _defaultState = {
	data: [
		'I have told you about each other. I will leave it to the two of you to connect.',
		'Here’s the introduction I promised. I will leave it to the two of you to connect.',
		'You two need to meet. Please let me know if you’d like more information.',
		'You should connect. Please let me know if you’d like more information.',
		'You need to meet! 😊',
		'Here’s the introduction I promised. 😊',
		'You should connect! You will like each other. 😊',
		'You have a lot in common. You should connect!',
		'Following up on our conversation, here is the introduction I promised',
		'You graduated from the same school. You need to meet! 😊 🎓',
		'You two are neighbors! You should connect! 🏠 😊',
		'You are both big readers. You should connect. 📚 😊',
		'You can thank me later! 😉 😉',
		'You two need to meet! 😉 😊 ❤️',
		'You two are perfect for each other ❤️, I just know it!',
		'This is a perfect match! ❤️',
		'Meet your beschert! ❤️',
		'Trust me, this is a good match! 😉',
		'I have a hunch you two will hit it off. 😊 😊',
		'You two are kindred spirits. 😊',
		'I think you two will like each other. 👍',
		'You two are meant to be! ❤️ ❤️',
		'You two are a good match. ❤️',
		'This is an inspired match!  ❤️ 😊',
	]
};

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.ADD_SAVED_MESSAGE:
			let newDataState = state.data
			newDataState.push(action.data)
			return { ...state, data: newDataState };
		default:
			return state;
	}
}

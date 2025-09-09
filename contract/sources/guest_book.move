module guest_book::guest_book;

use std::string::String;
use sui::event;
use sui::package;

//Error messages
#[error]
const ENotEventOwner: vector<u8> = b"The user is not event owner!";
#[error]
const EMessageTooLong:vector<u8> = b"Message length is too long!";
#[error]
const EMessageTooShort: vector<u8> = b"Message length is too short!";

//Constants
const MAX_MESSAGE_LENGTH: u64 = 200;
const MIN_MESSAGE_LENGTH: u64 = 4;

// === Structs ===

public struct Message has key,store {
    id:UID,
    sender: address,
    message: String,
    timestamp:u64
}

public struct Event has key {
    id:UID,
    owner: address,
    title: String,
    messages: vector<Message>,
    guest_addresses:vector<address>,
}

public struct MessageAdded has copy,drop{
    event_id: ID,
    sender: address,
    message: String,
    timestamp: u64,
}

public struct EventCreated has copy,drop{
    event_id: ID,
    owner: address,
    title: String,
}

public struct MessageInfo has copy, drop {
    sender: address,
    message: String,
    timestamp: u64,
}

//OTW- One Time Witness
public struct GUEST_BOOK has drop{}

// Initialize
fun init(otw:GUEST_BOOK, ctx: &mut TxContext)
{
    let publisher = package::claim(otw,ctx);
    transfer::public_transfer(publisher,ctx.sender()); 
}

// Functions
public entry fun create_event(
    title:String,
    ctx: &mut TxContext
){
    let event = Event{
        id: object::new(ctx),
        owner: ctx.sender(),
        title,
        messages: vector::empty(),
        guest_addresses: vector::empty(),
    };
    event::emit(EventCreated{
        event_id:object::id(&event),
        owner: ctx.sender(),
        title: event.title,
    });
    transfer::share_object(event);
}

public entry fun add_message(
    event: &mut Event,
    message: String,
    ctx: &mut TxContext
){
    let message_length = message.length();
    assert!(message_length >= MIN_MESSAGE_LENGTH, EMessageTooShort);
    assert!(message_length <= MAX_MESSAGE_LENGTH, EMessageTooLong);
    let timestamp = ctx.epoch_timestamp_ms();
    let sender = ctx.sender();
    let msg = Message{
        id: object::new(ctx),
        sender,
        message:message,
        timestamp,
    };

    if(!vector::contains(&event.guest_addresses, &sender))
    {
        vector::push_back(&mut event.guest_addresses, sender);
    };

    event::emit(MessageAdded{
        event_id:object::id(event),
        sender,
        message:msg.message,
        timestamp,
    });
    vector::push_back(&mut event.messages,msg);
}
public entry fun update_event_title(
    event: &mut Event, 
    new_title: String,
    ctx: &TxContext
) {
    assert!(is_event_owner(event, ctx.sender()), ENotEventOwner);
    event.title = new_title;
}

public fun get_event_info(event:&Event):(address, String, u64){
    (event.owner,event.title, vector::length(&event.messages))
}
public fun get_message_count(event: &Event): u64{
    vector::length(&event.messages)
}
public fun get_guest_count(event:&Event):u64{
    vector::length(&event.guest_addresses)
}

public fun get_message_at_index(event:&Event, index:u64): Option<MessageInfo> {
    if(index >= vector::length(&event.messages)){
        return option::none()
    };
    let message = vector::borrow(&event.messages, index);
    option::some(MessageInfo {
        sender: message.sender,
        message: message.message,
        timestamp: message.timestamp,
    })
}
public fun is_event_owner(event:&Event, addr: address):bool
{
    event.owner == addr
}
public fun get_guest_addresses(event:&Event, ctx:&TxContext): vector<address>{
    assert!(is_event_owner(event, ctx.sender()),ENotEventOwner);
    event.guest_addresses
}

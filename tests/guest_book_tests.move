/*
#[test_only]
module guest_book::guest_book_tests;
// uncomment this line to import the module
// use guest_book::guest_book;

const ENotImplemented: u64 = 0;

#[test]
fun test_guest_book() {
    // pass
}

#[test, expected_failure(abort_code = ::guest_book::guest_book_tests::ENotImplemented)]
fun test_guest_book_fail() {
    abort ENotImplemented
}
*/
#[test_only]
module guest_book::guest_book_tests;
use guest_book::guest_book::init;
use guest_book::guest_book::GUEST_BOOK;
fun init_for_testing(otw:GUEST_BOOK, ctx: &mut TxContext) {
    init(otw, ctx);
}